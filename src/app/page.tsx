import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Bienvenido al Sistema de Cotizaciones
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Gestione sus cotizaciones de trabajos verticales de forma eficiente.
        </p>
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Ir al Login
        </Link>
      </div>
    </div>
  );
}
