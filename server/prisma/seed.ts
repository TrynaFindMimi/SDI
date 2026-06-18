import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Vaciando base de datos...');

  await prisma.costAllocation.deleteMany();
  await prisma.importedProduct.deleteMany();
  await prisma.cost.deleteMany();
  await prisma.logisticsData.deleteMany();
  await prisma.import.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.productCatalog.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Base de datos vaciada');

  console.log('🌱 Creando admins...');

  const hash1 = await bcrypt.hash('70111118LP', 10);
  const hash2 = await bcrypt.hash('Mimi2705', 10);
  const hash3 = await bcrypt.hash('12345', 10);

  const admin1 = await prisma.user.create({
    data: {
      email: 'ghumerez@gmail.com',
      passwordHash: hash1,
      name: 'G Humerez',
      role: 'admin',
      status: 'approved',
      isActive: true
    }
  });

  console.log('✅ Admin creado:', admin1.email);

  const admin2 = await prisma.user.create({
    data: {
      email: 'nahomihumerez.4s@gmail.com',
      passwordHash: hash2,
      name: 'Nahomi Humerez',
      role: 'admin',
      status: 'approved',
      isActive: true
    }
  });

  console.log('✅ Admin creado:', admin2.email);

  const supervisor = await prisma.user.create({
    data: {
      email: 'carlos@gmail.com',
      passwordHash: hash3,
      name: 'Carlos',
      role: 'supervisor',
      status: 'approved',
      isActive: true
    }
  });

  console.log('✅ Supervisor creado:', supervisor.email);

  await prisma.permission.createMany({
    data: [
      { role: 'admin', resource: 'imports', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      { role: 'admin', resource: 'products', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      { role: 'admin', resource: 'costs', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      { role: 'admin', resource: 'catalog', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      { role: 'admin', resource: 'users', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      { role: 'supervisor', resource: 'imports', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      { role: 'supervisor', resource: 'products', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      { role: 'supervisor', resource: 'costs', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      { role: 'supervisor', resource: 'catalog', canCreate: true, canRead: true, canUpdate: true, canDelete: false }
    ]
  });

  console.log('✅ Permisos creados');
  console.log('\n🎉 Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
