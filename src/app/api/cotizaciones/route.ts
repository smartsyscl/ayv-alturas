import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function GET() {
  const cotizaciones = await prisma.cotizacion.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ cotizaciones });
}