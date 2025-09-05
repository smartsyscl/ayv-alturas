import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const cotizacion = await prisma.cotizacion.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        tipoServicio: data.tipoServicio,
        tipoEdificio: data.tipoEdificio,
        pisos: data.pisos,
        metrosCuadrados: data.metrosCuadrados,
        direccion: data.direccion,
        fechaEjecucion: new Date(data.fechaEjecucion),
        presupuesto: data.presupuesto,
        fotos: data.fotos || [],
        comentarios: data.comentarios,
        estado: "nuevo",
        notas: "",
      },
    });
    return NextResponse.json({ ok: true, cotizacion });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error?.toString() }, { status: 500 });
  }
}

export async function GET() {
  const cotizaciones = await prisma.cotizacion.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ cotizaciones });
}