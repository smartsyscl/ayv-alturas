import CotizacionForm from "@/components/forms/CotizacionForm";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Solicita una Cotización para tu Proyecto
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Completa el siguiente formulario y nos pondremos en contacto a la brevedad.
        </p>
        <CotizacionForm />
      </div>
    </main>
  );
}
