import { Request, Response } from 'express';
import { CostUseCases } from '../../../application/use-cases';

export class CostController {
  constructor(private costUseCases: CostUseCases) {}

  getByImportId = async (req: Request, res: Response): Promise<void> => {
    try {
      const costs = await this.costUseCases.getByImportId(req.params.importId);
      res.json({ success: true, data: costs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const cost = await this.costUseCases.create(req.params.importId, req.body);
      res.status(201).json({ success: true, data: cost });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const cost = await this.costUseCases.update(
        req.params.importId,
        req.params.costId,
        req.body
      );
      res.json({ success: true, data: cost });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.costUseCases.remove(req.params.importId, req.params.costId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };

  allocateCosts = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.costUseCases.allocateCosts(req.params.importId);
      res.json({ success: true, message: 'Costos distribuidos exitosamente' });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };
}
