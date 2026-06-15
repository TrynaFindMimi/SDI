import { Request, Response } from 'express';
import { ImportUseCases } from '../../../application/use-cases';
import { UpdateImportStatusDto } from '../../../application/dtos';

export class ImportController {
  constructor(private importUseCases: ImportUseCases) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const imports = await this.importUseCases.getAll();
      res.json({ success: true, data: imports });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const importEntity = await this.importUseCases.getById(req.params.id);
      if (!importEntity) {
        res.status(404).json({ success: false, error: { message: 'Importación no encontrada' } });
        return;
      }
      res.json({ success: true, data: importEntity });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const importEntity = await this.importUseCases.create(req.body);
      res.status(201).json({ success: true, data: importEntity });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const importEntity = await this.importUseCases.update(req.params.id, req.body);
      res.json({ success: true, data: importEntity });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = UpdateImportStatusDto.parse(req.body);
      const importEntity = await this.importUseCases.updateStatus(req.params.id, status as any);
      res.json({ success: true, data: importEntity });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.importUseCases.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };
}
