import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/db";

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
  fotos: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = cotizacionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ ok: false, error: "Datos inválidos", details: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { data } = validation;

    // Solución definitiva: No se convierte ningún tipo de dato.
    // Simplemente nos aseguramos de que los campos opcionales tengan un valor
    // de string vacío si no se proporcionan, para coincidir con el esquema de la BD.
    const cotizacion = await prisma.cotizacion.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        tipoServicio: data.tipoServicio,
        tipoEdificio: data.tipoEdificio,
        
        // Todos los campos opcionales del formulario se tratan como strings.
        pisos: data.pisos || "",
        metrosCuadrados: data.metrosCuadrados || "",
        direccion: data.direccion || "",
        presupuesto: data.presupuesto || "",
        comentarios: data.comentarios || "",
        

        // 'fechaEjecucion' también se trata como un simple string.
        fechaEjecucion: data.fechaEjecucion || "",
        
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
