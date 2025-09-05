"use client";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetch("/api/cotizaciones")
      .then(res => res.json())
      .then(data => setCotizaciones(data.cotizaciones || []));
  }, []);

  return (
    <table className="min-w-full border">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Tipo Servicio</th>
          <th>Estado</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {cotizaciones.map(c => (
          <tr key={c.id}>
            <td>{c.nombre}</td>
            <td>{c.email}</td>
            <td>{c.tipoServicio}</td>
            <td>{c.estado}</td>
            <td>{new Date(c.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}