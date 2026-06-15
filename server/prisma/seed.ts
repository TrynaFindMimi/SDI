import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  const genericAdminPasswordHash = await bcrypt.hash('12345', 10);
  const passwordHash = await bcrypt.hash('admin123', 10);

  const genericAdmin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      passwordHash: genericAdminPasswordHash,
      name: 'Admin Genérico',
      role: 'admin',
      isActive: true
    }
  });

  console.log('✅ Admin genérico creado:', genericAdmin.email);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@cdi.com' },
    update: {},
    create: {
      email: 'admin@cdi.com',
      passwordHash,
      name: 'Administrador',
      role: 'admin',
      isActive: true
    }
  });

  console.log('✅ Usuario admin creado:', admin.email);

  const supervisor = await prisma.user.upsert({
    where: { email: 'supervisor@cdi.com' },
    update: {},
    create: {
      email: 'supervisor@cdi.com',
      passwordHash,
      name: 'Supervisor Demo',
      role: 'supervisor',
      isActive: true
    }
  });

  console.log('✅ Usuario supervisor creado:', supervisor.email);

  const operator = await prisma.user.upsert({
    where: { email: 'operator@cdi.com' },
    update: {},
    create: {
      email: 'operator@cdi.com',
      passwordHash,
      name: 'Operador Demo',
      role: 'operator',
      isActive: true
    }
  });

  console.log('✅ Usuario operador creado:', operator.email);

  const reader = await prisma.user.upsert({
    where: { email: 'reader@cdi.com' },
    update: {},
    create: {
      email: 'reader@cdi.com',
      passwordHash,
      name: 'Lector Demo',
      role: 'reader',
      isActive: true
    }
  });

  console.log('✅ Usuario lector creado:', reader.email);

  console.log('\n📋 Credenciales de prueba:');
  console.log('   admin@admin.com / 12345');
  console.log('   admin@cdi.com / admin123');
  console.log('   supervisor@cdi.com / admin123');
  console.log('   operator@cdi.com / admin123');
  console.log('   reader@cdi.com / admin123');

  await prisma.permission.createMany({
    skipDuplicates: true,
    data: [
      { role: 'admin', resource: 'imports', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      { role: 'admin', resource: 'products', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      { role: 'admin', resource: 'costs', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      { role: 'admin', resource: 'catalog', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      { role: 'admin', resource: 'users', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      { role: 'supervisor', resource: 'imports', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      { role: 'supervisor', resource: 'products', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      { role: 'supervisor', resource: 'costs', canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      { role: 'supervisor', resource: 'catalog', canCreate: true, canRead: true, canUpdate: true, canDelete: false },
      { role: 'operator', resource: 'imports', canCreate: true, canRead: true, canUpdate: true, canDelete: false },
      { role: 'operator', resource: 'products', canCreate: true, canRead: true, canUpdate: true, canDelete: false },
      { role: 'operator', resource: 'costs', canCreate: true, canRead: true, canUpdate: true, canDelete: false },
      { role: 'operator', resource: 'catalog', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
      { role: 'reader', resource: 'imports', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
      { role: 'reader', resource: 'products', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
      { role: 'reader', resource: 'costs', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
      { role: 'reader', resource: 'catalog', canCreate: false, canRead: true, canUpdate: false, canDelete: false }
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
