import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12)
  
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@tuempresa.cl' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@tuempresa.cl',
      name: 'Administrador',
      password: hashedPassword,
      role: 'admin',
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })