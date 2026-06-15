import { CostAllocation } from '../entities/CostAllocation';

export interface ICostAllocationRepository {
  findByCostId(costId: string): Promise<CostAllocation[]>;
  findByProductId(productId: string): Promise<CostAllocation[]>;
  create(allocation: CostAllocation): Promise<CostAllocation>;
  createMany(allocations: CostAllocation[]): Promise<CostAllocation[]>;
  deleteByCostId(costId: string): Promise<void>;
}
