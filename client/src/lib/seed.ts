import { ImportFolder, ImportProduct, ImportCost, Supplier, ProductCatalog, ExchangeRate } from './entities';
import type { ImportFolder as IF, ImportProduct as IP, ImportCost as IC, Supplier as S, ProductCatalog as PC, ExchangeRate as ER } from './types';

export function seedData() {
  if (localStorage.getItem('logicost-seeded')) return;

  const folders: IF[] = [
    {
      id: 'f1', folder_number: '25CT0001', status: 'en_proceso',
      start_date: '2025-06-01', estimated_close_date: '2025-07-15',
      supplier: 'TechSupply China Ltd.', broker: 'Aduanas Global SRL',
      invoice_numbers: 'INV-2025-001', incoterm: 'FOB',
      transport_mode: 'Marítima', exchange_rate: 6.96, default_margin: 30,
      international_freight: 1200, international_insurance: 350,
      notes: 'Primera importación de prueba',
      timeline_events: [
        { date: '2025-06-01', event: 'Importación creada', status: 'completado' },
        { date: '2025-06-05', event: 'Embarque confirmado', status: 'completado' },
        { date: '2025-06-10', event: 'En tránsito', status: 'completado' },
        { date: '2025-06-20', event: 'Llegada a puerto', status: 'pendiente' },
      ],
      created_date: '2025-06-01',
    },
    {
      id: 'f2', folder_number: '25CT0002', status: 'cerrado',
      start_date: '2025-04-10', estimated_close_date: '2025-05-20',
      close_date: '2025-05-18',
      supplier: 'GlobalParts GmbH', broker: 'Logistik BO',
      invoice_numbers: 'GP-2025-042', incoterm: 'CIF',
      transport_mode: 'Aérea', exchange_rate: 6.95, default_margin: 25,
      international_freight: 2800, international_insurance: 500,
      notes: 'Segunda importación completada',
      timeline_events: [
        { date: '2025-04-10', event: 'Importación creada', status: 'completado' },
        { date: '2025-04-15', event: 'Embarque confirmado', status: 'completado' },
        { date: '2025-04-18', event: 'En tránsito', status: 'completado' },
        { date: '2025-05-05', event: 'Llegada a puerto', status: 'completado' },
        { date: '2025-05-18', event: 'Importación cerrada', status: 'completado' },
      ],
      created_date: '2025-04-10',
    },
  ];

  const products: IP[] = [
    { id: 'p1', folder_id: 'f1', code: 'EL-001', description: 'Módulo de control X200', quantity: 50, unit: 'PZA', unit_price_fob: 45.50, margin_percent: 30 },
    { id: 'p2', folder_id: 'f1', code: 'EL-002', description: 'Sensor de temperatura T100', quantity: 100, unit: 'PZA', unit_price_fob: 12.30, margin_percent: 35 },
    { id: 'p3', folder_id: 'f1', code: 'MC-001', description: 'Microcontrolador PIC18F', quantity: 200, unit: 'PZA', unit_price_fob: 8.75, margin_percent: 30 },
    { id: 'p4', folder_id: 'f2', code: 'GP-001', description: 'Rodamiento 6205-2RS', quantity: 300, unit: 'PZA', unit_price_fob: 4.20, margin_percent: 25 },
    { id: 'p5', folder_id: 'f2', code: 'GP-002', description: 'Correa síncrona HTD-400', quantity: 80, unit: 'PZA', unit_price_fob: 18.90, margin_percent: 25 },
  ];

  const costs: IC[] = [
    { id: 'c1', folder_id: 'f1', date: '2025-06-05', receipt_number: 'REC-001', category: 'Aduana', description: 'Despacho aduanero', currency: 'BOB', amount: 2500, exchange_rate: 6.96 },
    { id: 'c2', folder_id: 'f1', date: '2025-06-08', receipt_number: 'REC-002', category: 'Transporte', description: 'Flete local puerto-planta', currency: 'BOB', amount: 1800, exchange_rate: 6.96 },
    { id: 'c3', folder_id: 'f1', date: '2025-06-10', receipt_number: 'REC-003', category: 'Logística', description: 'Almacenaje temporal', currency: 'USD', amount: 200, exchange_rate: 6.96 },
    { id: 'c4', folder_id: 'f2', date: '2025-04-20', receipt_number: 'REC-004', category: 'Financiero', description: 'Comisión bancaria transferencia', currency: 'USD', amount: 45, exchange_rate: 6.95 },
    { id: 'c5', folder_id: 'f2', date: '2025-04-22', receipt_number: 'REC-005', category: 'Aduana', description: 'Honorarios agente aduanal', currency: 'BOB', amount: 3200, exchange_rate: 6.95 },
    { id: 'c6', folder_id: 'f2', date: '2025-04-25', receipt_number: 'REC-006', category: 'Permisos', description: 'Certificado de origen', currency: 'BOB', amount: 450, exchange_rate: 6.95 },
  ];

  const suppliers: S[] = [
    { id: 's1', name: 'TechSupply China Ltd.', country: 'China', contact: 'Li Wei', email: 'liwei@techsupply.cn', phone: '+86 21 5555-0100' },
    { id: 's2', name: 'GlobalParts GmbH', country: 'Alemania', contact: 'Hans Mueller', email: 'hans@globalparts.de', phone: '+49 89 1234-5678' },
    { id: 's3', name: 'Importec S.A.', country: 'Brasil', contact: 'Carlos Silva', email: 'carlos@importec.com.br', phone: '+55 11 3333-4455' },
  ];

  const rates: ER[] = [
    { id: 'r1', date: '2025-04-01', rate: 6.95, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
    { id: 'r2', date: '2025-05-01', rate: 6.95, created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z' },
    { id: 'r3', date: '2025-06-01', rate: 6.96, created_at: '2025-06-01T00:00:00Z', updated_at: '2025-06-01T00:00:00Z' },
    { id: 'r4', date: '2025-06-10', rate: 7.10, created_at: '2025-06-10T00:00:00Z', updated_at: '2025-06-10T00:00:00Z' },
    { id: 'r5', date: '2025-06-15', rate: 7.25, created_at: '2025-06-15T00:00:00Z', updated_at: '2025-06-15T00:00:00Z' },
  ];

  const catalog: PC[] = [
    { id: 'pc1', code: 'EL-001', name: 'Módulo de control X200', category: 'Electrónica', default_unit: 'PZA', reference_price: 45.50 },
    { id: 'pc2', code: 'EL-002', name: 'Sensor de temperatura T100', category: 'Electrónica', default_unit: 'PZA', reference_price: 12.30 },
    { id: 'pc3', code: 'MC-001', name: 'Microcontrolador PIC18F', category: 'Componentes', default_unit: 'PZA', reference_price: 8.75 },
    { id: 'pc4', code: 'GP-001', name: 'Rodamiento 6205-2RS', category: 'Mecánica', default_unit: 'PZA', reference_price: 4.20 },
    { id: 'pc5', code: 'GP-002', name: 'Correa síncrona HTD-400', category: 'Mecánica', default_unit: 'PZA', reference_price: 18.90 },
  ];

  rates.forEach(r => ExchangeRate.create(r));

  folders.forEach(f => ImportFolder.create(f));
  products.forEach(p => ImportProduct.create(p));
  costs.forEach(c => ImportCost.create(c));
  suppliers.forEach(s => Supplier.create(s));
  catalog.forEach(c => ProductCatalog.create(c));

  localStorage.setItem('logicost-seeded', 'true');
}
