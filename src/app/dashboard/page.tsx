import CotizacionesTable from "@/components/dashboard/CotizacionesTable";

export default function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Cotizaciones</h1>
      <CotizacionesTable />
    </main>
  );
}