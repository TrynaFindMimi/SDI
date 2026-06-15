import { Supplier } from '../entities/Supplier';

export interface ISupplierRepository {
  findAll(): Promise<Supplier[]>;
  findById(id: string): Promise<Supplier | null>;
  findByName(name: string): Promise<Supplier | null>;
  findByCountry(country: string): Promise<Supplier[]>;
  create(supplier: Supplier): Promise<Supplier>;
  update(supplier: Supplier): Promise<Supplier>;
  delete(id: string): Promise<void>;
}
