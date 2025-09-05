import CotizacionForm from "@/components/forms/CotizacionForm";
import { Building } from "lucide-react";

export default function HomePage() {
  return (
    // Fondo con degradado sutil para un look más profesional
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100">
      
      {/* Encabezado simple y limpio */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Building className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">AYV Alturas</h1>
              <p className="text-sm text-gray-600">Cotización de Trabajos Verticales en Línea</p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal que centra el formulario */}
      <main className="container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          <CotizacionForm />
        </div>
      </main>

    </div>
  );
}
