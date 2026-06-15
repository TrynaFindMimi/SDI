import { Request, Response } from 'express';
import { AuthUseCases } from '../../../application/use-cases';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  constructor(private authUseCases: AuthUseCases) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.authUseCases.login(req.body);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(401).json({ success: false, error: { message: error.message } });
    }
  };

  me = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await this.authUseCases.getById(req.userId!);
      if (!user) {
        res.status(404).json({ success: false, error: { message: 'Usuario no encontrado' } });
        return;
      }
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.authUseCases.getAll();
      res.json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.authUseCases.create(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.authUseCases.update(req.params.id, req.body);
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.authUseCases.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };
}
