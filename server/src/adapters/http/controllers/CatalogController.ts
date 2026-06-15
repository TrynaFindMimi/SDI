import { Request, Response } from 'express';
import { CatalogUseCases } from '../../../application/use-cases';

export class CatalogController {
  constructor(private catalogUseCases: CatalogUseCases) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.catalogUseCases.getAll();
      res.json({ success: true, data: products });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.catalogUseCases.getById(req.params.id);
      if (!product) {
        res.status(404).json({ success: false, error: { message: 'Producto no encontrado' } });
        return;
      }
      res.json({ success: true, data: product });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.catalogUseCases.create(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.catalogUseCases.update(req.params.id, req.body);
      res.json({ success: true, data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.catalogUseCases.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };
}
