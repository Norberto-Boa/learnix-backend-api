import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const salt = await bcrypt.genSalt();
  const senhaHash = await bcrypt.hash('admin123', salt);

  console.log('🚀 Iniciando teste de conexão...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@escola.com' },
    update: {},
    create: {
      name: 'Administrador Inicial',
      email: 'admin@escola.com',
      password: senhaHash,
      role: 'SUPERADMIN', // Certifique-se que o Enum no seu schema tem 'ADMIN'
    },
  });

  console.log('✅ Conexão bem-sucedida! Usuário criado:', admin.name);
}

main()
  .catch((e) => {
    console.error('❌ Erro na conexão:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
