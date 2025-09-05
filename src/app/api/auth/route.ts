import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { verifyPassword, signToken } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 });
  }
  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }
  const token = await signToken({ id: user.id, email: user.email, role: user.role });
  return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
}