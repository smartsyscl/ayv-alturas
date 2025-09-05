"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

// Esquema de validación con Zod
const schema = z.object({
  nombre: z.string().min(3, { message: "El nombre es requerido." }),
  email: z.string().email({ message: "Por favor, ingresa un email válido." }),
  telefono: z.string().min(7, { message: "El teléfono es requerido." }),
  tipoServicio: z.string().min(2, { message: "El tipo de servicio es requerido." }),
  tipoEdificio: z.string().min(2, { message: "El tipo de edificio es requerido." }),
  pisos: z.string().optional(),
  metrosCuadrados: z.string().optional(),
  direccion: z.string().optional(),
  fechaEjecucion: z.string().optional(),
  presupuesto: z.string().optional(),
  comentarios: z.string().optional(),
  urgencia: z.string().optional(),
  fotos: z.any().optional(), // `fotos` será una lista de archivos
});

type FormData = z.infer<typeof schema>;

export default function CotizacionForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Subir las imágenes a través de nuestra API
      const fotosUrls: string[] = [];
      if (data.fotos && data.fotos.length > 0) {
        const files = Array.from(data.fotos as FileList);

        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            throw new Error("Hubo un error al subir una de las imágenes.");
          }

          const resData = await res.json();
          fotosUrls.push(resData.url);
        }
      }

      // 2. Enviar los datos del formulario (con las URLs de las fotos) a la API
      const response = await fetch("/api/cotizaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Enviamos todos los datos del formulario, reemplazando `fotos` con las URLs
        body: JSON.stringify({ ...data, fotos: fotosUrls }),
      });

      if (!response.ok) {
        throw new Error("Hubo un error al enviar la cotización.");
      }

      // 3. Manejar el éxito
      setSuccess(true);
      reset(); // Limpiar el formulario

    } catch (err: any) {
      setError(err.message || "Algo salió mal. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-8 bg-green-100 text-green-800 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">¡Cotización Enviada!</h2>
        <p>Gracias por contactarnos. Te responderemos a la brevedad.</p>
        <button onClick={() => setSuccess(false)} className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Enviar otra cotización
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Campos del formulario */}
      <input {...register("nombre")} placeholder="Nombre Completo" className="input" />
      {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}

      <input {...register("email")} placeholder="Email" className="input" />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <input {...register("telefono")} placeholder="Teléfono de Contacto" className="input" />
      {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono.message}</p>}

      <input {...register("tipoServicio")} placeholder="Tipo de Servicio (ej. Pintura, Remodelación)" className="input" />
       {errors.tipoServicio && <p className="text-red-500 text-sm">{errors.tipoServicio.message}</p>}

      <input {...register("tipoEdificio")} placeholder="Tipo de Propiedad (ej. Casa, Departamento)" className="input" />
      {errors.tipoEdificio && <p className="text-red-500 text-sm">{errors.tipoEdificio.message}</p>}

      <input {...register("pisos")} type="number" placeholder="Cantidad de Pisos (opcional)" className="input" />
      <input {...register("metrosCuadrados")} type="number" placeholder="Metros Cuadrados (aprox.)" className="input" />
      <input {...register("direccion")} placeholder="Dirección (opcional)" className="input" />
      
      <div>
        <label htmlFor="fechaEjecucion" className="block text-sm font-medium text-gray-700">Fecha estimada de ejecución (opcional)</label>
        <input id="fechaEjecucion" {...register("fechaEjecucion")} type="date" className="input" />
      </div>

      <input {...register("presupuesto")} placeholder="Presupuesto Estimado (opcional)" className="input" />

      <div>
        <label htmlFor="fotos" className="block text-sm font-medium text-gray-700">Adjuntar Fotos (opcional)</label>
        <input id="fotos" {...register("fotos")} type="file" multiple className="input" />
      </div>

      <textarea {...register("comentarios")} placeholder="Comentarios adicionales sobre el proyecto" className="input" rows={4}/>

      <select {...register("urgencia")} className="input">
        <option value="">Selecciona la urgencia (opcional)</option>
        <option value="alta">Alta - ¡Lo necesito ya!</option>
        <option value="media">Media - Flexible</option>
        <option value="baja">Baja - Solo estoy cotizando</option>
      </select>
      
      <button type="submit" disabled={loading} className="btn w-full">
        {loading ? "Enviando..." : "Solicitar Cotización"}
      </button>

      {error && <div className="text-red-600 bg-red-100 p-3 rounded text-center">{error}</div>}
    </form>
  );
}
