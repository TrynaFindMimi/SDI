import { Request, Response } from 'express';
import { SupplierUseCases } from '../../../application/use-cases';

export class SupplierController {
  constructor(private supplierUseCases: SupplierUseCases) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const suppliers = await this.supplierUseCases.getAll();
      res.json({ success: true, data: suppliers });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const supplier = await this.supplierUseCases.getById(req.params.id);
      if (!supplier) {
        res.status(404).json({ success: false, error: { message: 'Proveedor no encontrado' } });
        return;
      }
      res.json({ success: true, data: supplier });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const supplier = await this.supplierUseCases.create(req.body);
      res.status(201).json({ success: true, data: supplier });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const supplier = await this.supplierUseCases.update(req.params.id, req.body);
      res.json({ success: true, data: supplier });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.supplierUseCases.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };
}
