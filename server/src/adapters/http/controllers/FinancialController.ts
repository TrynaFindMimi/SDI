import { Request, Response } from 'express';
import { FinancialUseCases } from '../../../application/use-cases';

export class FinancialController {
  constructor(private financialUseCases: FinancialUseCases) {}

  getSummary = async (req: Request, res: Response): Promise<void> => {
    try {
      const summary = await this.financialUseCases.getSummary(req.params.importId);
      res.json({ success: true, data: summary });
    } catch (error: any) {
      res.status(400).json({ success: false, error: { message: error.message } });
    }
  };
}
