import { ISupplierRepository } from '../../domain/repositories';
import { Supplier } from '../../domain/entities';
import { CreateSupplierInput, UpdateSupplierInput } from '../dtos';

export class SupplierUseCases {
  constructor(private supplierRepository: ISupplierRepository) {}

  async getAll(): Promise<Supplier[]> {
    return this.supplierRepository.findAll();
  }

  async getById(id: string): Promise<Supplier | null> {
    return this.supplierRepository.findById(id);
  }

  async create(data: CreateSupplierInput): Promise<Supplier> {
    const supplier = Supplier.create(data);
    return this.supplierRepository.create(supplier);
  }

  async update(id: string, data: UpdateSupplierInput): Promise<Supplier> {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) {
      throw new Error('Proveedor no encontrado');
    }

    if (data.name !== undefined) supplier.name = data.name;
    if (data.country !== undefined) supplier.country = data.country;
    if (data.contactName !== undefined) supplier.contactName = data.contactName;
    if (data.contactEmail !== undefined) supplier.contactEmail = data.contactEmail;
    if (data.contactPhone !== undefined) supplier.contactPhone = data.contactPhone;
    if (data.address !== undefined) supplier.address = data.address;
    if (data.taxId !== undefined) supplier.taxId = data.taxId;
    if (data.isActive !== undefined) supplier.isActive = data.isActive;

    supplier.updatedAt = new Date();
    return this.supplierRepository.update(supplier);
  }

  async delete(id: string): Promise<void> {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) {
      throw new Error('Proveedor no encontrado');
    }
    return this.supplierRepository.delete(id);
  }
}
