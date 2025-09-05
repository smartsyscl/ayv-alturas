"use client";
import { useEffect, useState } from "react";

// Definimos un tipo más completo para la cotización,
// que coincida con lo que esperamos de la API.
type Cotizacion = {
  id: string;
  nombre: string;
  email: string;
  tipoServicio: string;
  estado: string;
  createdAt: string;
};

export default function CotizacionesTable() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCotizaciones = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/cotizaciones");
        if (!res.ok) {
          throw new Error("No se pudieron cargar las cotizaciones.");
        }
        const data = await res.json();
        setCotizaciones(data.cotizaciones || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCotizaciones();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Cargando cotizaciones...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (cotizaciones.length === 0) {
    return <div className="text-center py-8">Aún no hay cotizaciones para mostrar.</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo de Servicio</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha de Solicitud</th>
          </tr>
        </thead>
        <tbody>
          {cotizaciones.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50 border-b">
              <td className="py-3 px-4 text-gray-800">{c.nombre}</td>
              <td className="py-3 px-4 text-gray-600">{c.email}</td>
              <td className="py-3 px-4 text-gray-600">{c.tipoServicio}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${c.estado === 'pendiente' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                  {c.estado}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-600">
                {new Date(c.createdAt).toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}