import { LogisticsData } from '../entities/LogisticsData';

export interface ILogisticsRepository {
  findByImportId(importId: string): Promise<LogisticsData | null>;
  create(logistics: LogisticsData): Promise<LogisticsData>;
  update(logistics: LogisticsData): Promise<LogisticsData>;
  deleteByImportId(importId: string): Promise<void>;
}
