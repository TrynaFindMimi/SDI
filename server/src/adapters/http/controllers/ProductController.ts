import { Request, Response } from 'express';
import { ProductUseCases } from '../../../application/use-cases';

export class ProductController {
  constructor(private productUseCases: ProductUseCases) {}

  getByImportId = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.productUseCases.getByImportId(req.params.importId);
      res.json({ success: true, data: products });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  };

  addToImport = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productUseCases.addToImport(req.params.importId, req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productUseCases.update(
        req.params.importId,
        req.params.productId,
        req.body
      );
      res.json({ success: true, data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };

  removeFromImport = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.productUseCases.removeFromImport(req.params.importId, req.params.productId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };
}
