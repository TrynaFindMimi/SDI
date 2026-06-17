import { Router } from 'express';
import { PrismaImportRepository } from '../../../infrastructure/persistence/postgres/PrismaImportRepository';
import { PrismaLogisticsRepository } from '../../../infrastructure/persistence/postgres/PrismaLogisticsRepository';
import { PrismaSupplierRepository } from '../../../infrastructure/persistence/postgres/PrismaSupplierRepository';
import { PrismaProductCatalogRepository } from '../../../infrastructure/persistence/postgres/PrismaProductCatalogRepository';
import { PrismaImportedProductRepository } from '../../../infrastructure/persistence/postgres/PrismaImportedProductRepository';
import { PrismaCostRepository } from '../../../infrastructure/persistence/postgres/PrismaCostRepository';
import { PrismaCostAllocationRepository } from '../../../infrastructure/persistence/postgres/PrismaCostAllocationRepository';
import { PrismaUserRepository } from '../../../infrastructure/persistence/postgres/PrismaUserRepository';
import { ImportUseCases, ProductUseCases, CostUseCases, FinancialUseCases, AuthUseCases, SupplierUseCases, CatalogUseCases } from '../../../application/use-cases';
import { ImportController } from '../controllers/ImportController';
import { ProductController } from '../controllers/ProductController';
import { CostController } from '../controllers/CostController';
import { FinancialController } from '../controllers/FinancialController';
import { AuthController } from '../controllers/AuthController';
import { SupplierController } from '../controllers/SupplierController';
import { CatalogController } from '../controllers/CatalogController';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

const importRepo = new PrismaImportRepository();
const logisticsRepo = new PrismaLogisticsRepository();
const supplierRepo = new PrismaSupplierRepository();
const catalogRepo = new PrismaProductCatalogRepository();
const importedProductRepo = new PrismaImportedProductRepository();
const costRepo = new PrismaCostRepository();
const costAllocationRepo = new PrismaCostAllocationRepository();
const userRepo = new PrismaUserRepository();

const importUseCases = new ImportUseCases(importRepo);
const productUseCases = new ProductUseCases(importedProductRepo, catalogRepo);
const costUseCases = new CostUseCases(costRepo, costAllocationRepo, importedProductRepo);
const financialUseCases = new FinancialUseCases(importRepo, costRepo, importedProductRepo, costAllocationRepo);
const authUseCases = new AuthUseCases(userRepo);
const supplierUseCases = new SupplierUseCases(supplierRepo);
const catalogUseCases = new CatalogUseCases(catalogRepo);

const importController = new ImportController(importUseCases);
const productController = new ProductController(productUseCases);
const costController = new CostController(costUseCases);
const financialController = new FinancialController(financialUseCases);
const authController = new AuthController(authUseCases);
const supplierController = new SupplierController(supplierUseCases);
const catalogController = new CatalogController(catalogUseCases);

// Auth
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.get('/auth/me', authMiddleware, authController.me);

// Users (admin only)
router.get('/users', authMiddleware, requireRole('admin'), authController.getAll);
router.post('/users', authMiddleware, requireRole('admin'), authController.create);
router.put('/users/:id', authMiddleware, requireRole('admin'), authController.update);
router.patch('/users/:id/approve', authMiddleware, requireRole('admin'), authController.approveUser);
router.patch('/users/:id/reject', authMiddleware, requireRole('admin'), authController.rejectUser);
router.delete('/users/:id', authMiddleware, requireRole('admin'), authController.delete);

// Imports
router.get('/imports', authMiddleware, importController.getAll);
router.post('/imports', authMiddleware, requireRole('admin', 'supervisor', 'operator'), importController.create);
router.get('/imports/:id', authMiddleware, importController.getById);
router.put('/imports/:id', authMiddleware, requireRole('admin', 'supervisor', 'operator'), importController.update);
router.patch('/imports/:id/status', authMiddleware, requireRole('admin', 'supervisor'), importController.updateStatus);
router.delete('/imports/:id', authMiddleware, requireRole('admin', 'supervisor'), importController.delete);

// Logistics
router.get('/imports/:importId/logistics', authMiddleware, async (req, res) => {
  try {
    const data = await logisticsRepo.findByImportId(req.params.importId);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});
router.post('/imports/:importId/logistics', authMiddleware, requireRole('admin', 'supervisor', 'operator'), async (req, res) => {
  try {
    const existing = await logisticsRepo.findByImportId(req.params.importId);
    const { LogisticsData } = require('../../domain/entities');
    if (existing) {
      Object.assign(existing, req.body);
      existing.updatedAt = new Date();
      const updated = await logisticsRepo.update(existing);
      res.json({ success: true, data: updated });
    } else {
      const logistics = LogisticsData.create({ ...req.body, importId: req.params.importId });
      const created = await logisticsRepo.create(logistics);
      res.status(201).json({ success: true, data: created });
    }
  } catch (error: any) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
});

// Products
router.get('/imports/:importId/products', authMiddleware, productController.getByImportId);
router.post('/imports/:importId/products', authMiddleware, requireRole('admin', 'supervisor', 'operator'), productController.addToImport);
router.put('/imports/:importId/products/:productId', authMiddleware, requireRole('admin', 'supervisor', 'operator'), productController.update);
router.delete('/imports/:importId/products/:productId', authMiddleware, requireRole('admin', 'supervisor'), productController.removeFromImport);

// Costs
router.get('/imports/:importId/costs', authMiddleware, costController.getByImportId);
router.post('/imports/:importId/costs', authMiddleware, requireRole('admin', 'supervisor', 'operator'), costController.create);
router.put('/imports/:importId/costs/:costId', authMiddleware, requireRole('admin', 'supervisor', 'operator'), costController.update);
router.delete('/imports/:importId/costs/:costId', authMiddleware, requireRole('admin', 'supervisor'), costController.remove);
router.post('/imports/:importId/costs/allocate', authMiddleware, requireRole('admin', 'supervisor'), costController.allocateCosts);

// Financial
router.get('/imports/:importId/financial-summary', authMiddleware, financialController.getSummary);

// Suppliers
router.get('/catalog/suppliers', authMiddleware, supplierController.getAll);
router.post('/catalog/suppliers', authMiddleware, requireRole('admin', 'supervisor'), supplierController.create);
router.get('/catalog/suppliers/:id', authMiddleware, supplierController.getById);
router.put('/catalog/suppliers/:id', authMiddleware, requireRole('admin', 'supervisor'), supplierController.update);
router.delete('/catalog/suppliers/:id', authMiddleware, requireRole('admin'), supplierController.delete);

// Catalog Products
router.get('/catalog/products', authMiddleware, catalogController.getAll);
router.post('/catalog/products', authMiddleware, requireRole('admin', 'supervisor'), catalogController.create);
router.get('/catalog/products/:id', authMiddleware, catalogController.getById);
router.put('/catalog/products/:id', authMiddleware, requireRole('admin', 'supervisor'), catalogController.update);
router.delete('/catalog/products/:id', authMiddleware, requireRole('admin'), catalogController.delete);

export default router;
