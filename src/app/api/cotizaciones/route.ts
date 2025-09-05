import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/db";

// 1. Definimos un esquema de validación con Zod para el backend.
// Esto asegura que los datos que procesamos tienen la forma que esperamos.
const cotizacionSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido."),
  email: z.string().email("El email no es válido."),
  telefono: z.string().min(7, "El teléfono es requerido."),
  tipoServicio: z.string().min(2, "El tipo de servicio es requerido."),
  tipoEdificio: z.string().min(2, "El tipo de edificio es requerido."),
  pisos: z.string().optional(),
  metrosCuadrados: z.string().optional(),
  direccion: z.string().optional(),
  fechaEjecucion: z.string().optional(),
  presupuesto: z.string().optional(),
  comentarios: z.string().optional(),
  urgencia: z.string().optional(),
  fotos: z.array(z.string()).optional(), // Esperamos un array de URLs
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 2. Validamos los datos del body contra el esquema.
    const validation = cotizacionSchema.safeParse(body);

    if (!validation.success) {
      // Si la validación falla, devolvemos un error 400 con los detalles.
      return NextResponse.json({ ok: false, error: "Datos inválidos", details: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    // 3. Los datos son válidos, procedemos con el procesamiento.
    const { data } = validation;

    // Conversión de tipos de datos, ahora con la certeza de que los datos existen si fueron provistos.
    const pisos = data.pisos ? parseInt(data.pisos, 10) : null;
    const metrosCuadrados = data.metrosCuadrados ? parseFloat(data.metrosCuadrados) : null;
    const fechaEjecucion = data.fechaEjecucion && !isNaN(new Date(data.fechaEjecucion).getTime()) 
                             ? new Date(data.fechaEjecucion) 
                             : null;

    // 4. Creamos el registro en la base de datos con datos limpios y validados.
    const cotizacion = await prisma.cotizacion.create({
      data: {
        ...data,
        pisos,
        metrosCuadrados,
        fechaEjecucion,
        fotos: data.fotos || [],
        estado: "pendiente",
        notas: "",
      },
    });

    return NextResponse.json({ ok: true, cotizacion });

  } catch (error) {
    console.error("Error al crear la cotización:", error);
    return NextResponse.json({ ok: false, error: "No se pudo crear la cotización." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cotizaciones = await prisma.cotizacion.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ cotizaciones });
  } catch (error) {
    console.error("Error al obtener las cotizaciones:", error);
    return NextResponse.json({ ok: false, error: "No se pudieron obtener las cotizaciones." }, { status: 500 });
  }
}
