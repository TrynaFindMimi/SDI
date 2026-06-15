const DB_KEY = 'logicost-db';

function getDb(): Record<string, any[]> {
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveDb(db: Record<string, any[]>): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function collection<T>(name: string): T[] {
  const db = getDb();
  if (!db[name]) db[name] = [];
  return db[name] as T[];
}

function saveCollection<T>(name: string, data: T[]): void {
  const db = getDb();
  db[name] = data;
  saveDb(db);
}

function genId(): string {
  return crypto.randomUUID();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class BaseEntity<_T extends { id?: string } = any> {
  protected static entityName: string;

  static async list<T>(order?: string): Promise<T[]> {
    const items = collection<T>(this.entityName);
    if (order?.startsWith('-')) {
      const field = order.slice(1);
      items.sort((a: any, b: any) => new Date(b[field] || 0).getTime() - new Date(a[field] || 0).getTime());
    }
    return items;
  }

  static async filter<T>(query: Record<string, any>): Promise<T[]> {
    const items = collection<T>(this.entityName);
    return items.filter(item =>
      Object.entries(query).every(([key, val]) => (item as any)[key] === val)
    );
  }

  static async getById<T>(id: string): Promise<T | null> {
    const items = collection<T>(this.entityName);
    return items.find(item => (item as any).id === id) || null;
  }

  static async create<T extends { id?: string }>(data: T): Promise<T> {
    const items = collection<T>(this.entityName);
    const newItem = { ...data, id: data.id || genId() } as T;
    items.push(newItem);
    saveCollection(this.entityName, items);
    return newItem;
  }

  static async update<T>(id: string, data: Partial<T>): Promise<T | null> {
    const items = collection<T>(this.entityName);
    const idx = items.findIndex(item => (item as any).id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data };
    saveCollection(this.entityName, items);
    return items[idx];
  }

  static async delete(id: string): Promise<void> {
    let items = collection(this.entityName);
    items = items.filter(item => (item as any).id !== id);
    saveCollection(this.entityName, items);
  }
}

export class User extends BaseEntity<User> { static entityName = 'users'; }
export class ImportFolder extends BaseEntity<ImportFolder> { static entityName = 'import_folders'; }
export class ImportProduct extends BaseEntity<ImportProduct> { static entityName = 'import_products'; }
export class ImportCost extends BaseEntity<ImportCost> { static entityName = 'import_costs'; }
export class Supplier extends BaseEntity<Supplier> { static entityName = 'suppliers'; }
export class ProductCatalog extends BaseEntity<ProductCatalog> { static entityName = 'product_catalog'; }
export class ExchangeRate extends BaseEntity<ExchangeRate> { static entityName = 'exchange_rates'; }

export async function getRateForDate(date: string): Promise<number> {
  const rates = (await ExchangeRate.list<any>('-date')) as any[];
  const sorted = rates.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const match = sorted.find((r: any) => r.date <= date);
  return match?.rate || 6.96;
}

export async function setDailyRate(rate: number): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const existing = (await ExchangeRate.filter<any>({ date: today })) as any[];
  if (existing.length > 0) {
    await ExchangeRate.update(existing[0].id!, { rate, updated_at: new Date().toISOString() });
  } else {
    await ExchangeRate.create({ date: today, rate, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as any);
  }
}
