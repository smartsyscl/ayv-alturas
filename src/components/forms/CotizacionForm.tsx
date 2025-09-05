"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const schema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().min(7),
  tipoServicio: z.string().min(2),
  tipoEdificio: z.string().min(2),
  pisos: z.string(),
  metrosCuadrados: z.string(),
  direccion: z.string(),
  fechaEjecucion: z.string(),
  presupuesto: z.string().optional(),
  comentarios: z.string().optional(),
  urgencia: z.string().optional(),
  fotos: z.any().optional(),
});

export default function CotizacionForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  type FormData = z.infer<typeof schema>;
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const fotosUrls: string[] = [];
    if (data.fotos && data.fotos.length > 0) {
      const files = Array.from(data.fotos);
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file as File);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const resData = await res.json();
        if (resData.secure_url) fotosUrls.push(resData.secure_url);
      }
    }
    const response = await fetch("/api/cotizaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, fotos: fotosUrls }),
    });
    setLoading(false);
    if (response.ok) {
      setSuccess(true);
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto">
      <input {...register("nombre")} placeholder="Nombre" className="input" />
      <input {...register("email")} placeholder="Email" className="input" />
      <input {...register("telefono")} placeholder="Teléfono" className="input" />
      <input {...register("tipoServicio")} placeholder="Tipo de Servicio" className="input" />
      <input {...register("tipoEdificio")} placeholder="Tipo de Edificio" className="input" />
      <input {...register("pisos")} placeholder="Cantidad de Pisos" className="input" />
      <input {...register("metrosCuadrados")} placeholder="Metros Cuadrados" className="input" />
      <input {...register("direccion")} placeholder="Dirección" className="input" />
      <input {...register("fechaEjecucion")} type="date" className="input" />
      <input {...register("presupuesto")} placeholder="Presupuesto (opcional)" className="input" />
      <input {...register("fotos")} type="file" multiple className="input" />
      <textarea {...register("comentarios")} placeholder="Comentarios (opcional)" className="input" />
      <select {...register("urgencia")} className="input">
        <option value="">Urgencia</option>
        <option value="alta">Alta</option>
        <option value="media">Media</option>
        <option value="baja">Baja</option>
      </select>
      <button type="submit" disabled={loading} className="btn">
        {loading ? "Enviando..." : "Enviar Cotización"}
      </button>
      {success && <div className="text-green-600">¡Cotización enviada!</div>}
      {Object.keys(errors).length > 0 && (
        <div className="text-red-500">Por favor, revisa los campos.</div>
      )}
    </form>
  );
}