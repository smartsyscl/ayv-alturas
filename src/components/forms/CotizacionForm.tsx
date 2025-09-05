"use client";
import { useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronRight, ChevronLeft, Building, Upload, CheckCircle } from 'lucide-react';

// Esquema de validación actualizado para coincidir con el formulario de varios pasos
const schema = z.object({
  nombre: z.string().min(3, "El nombre es requerido"),
  email: z.string().email("Por favor, ingresa un email válido"),
  telefono: z.string().min(7, "El teléfono es requerido"),
  tipoServicio: z.string().min(1, "El tipo de servicio es requerido"),
  tipoEdificio: z.string().min(1, "El tipo de edificio es requerido"),
  pisos: z.string().min(1, "El número de pisos es requerido"),
  metrosCuadrados: z.string().min(1, "Los metros cuadrados son requeridos"),
  direccion: z.string().min(5, "La dirección es requerida"),
  fechaEjecucion: z.string().min(1, "La fecha estimada es requerida"),
  presupuesto: z.string().optional(),
  comentarios: z.string().optional(),
  fotos: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

// --- Datos para los menús desplegables ---
const servicios = ['Pintura de fachada', 'Impermeabilización', 'Limpieza de vidrios', 'Instalación de piedra/chapas', 'Sellado de juntas', 'Mantenimiento general', 'Otro'];
const tiposEdificio = ['Residencial', 'Corporativo', 'Comercial', 'Industrial', 'Institucional'];
const rangosPresupuesto = ['Menos de $1.000.000', '$1.000.000 - $2.000.000', '$2.000.000 - $5.000.000', '$5.000.000 - $10.000.000', 'Más de $10.000.000'];

export default function CotizacionForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, trigger, getValues, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const fotos = watch('fotos');

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    if (currentStep === 1) fieldsToValidate = ['nombre', 'email', 'telefono'];
    if (currentStep === 2) fieldsToValidate = ['tipoServicio', 'tipoEdificio', 'pisos', 'metrosCuadrados', 'direccion'];
    if (currentStep === 3) fieldsToValidate = ['fechaEjecucion'];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const fotosUrls: string[] = [];
      if (data.fotos && data.fotos.length > 0) {
        const files = Array.from(data.fotos as FileList);
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          if (!res.ok) throw new Error("Error al subir una imagen.");
          const resData = await res.json();
          fotosUrls.push(resData.url);
        }
      }

      const response = await fetch("/api/cotizaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, fotos: fotosUrls }),
      });

      if (!response.ok) throw new Error("Hubo un error al enviar la cotización.");
      
      setSuccess(true);
      setCurrentStep(5); // Ir al paso de confirmación

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Algo salió mal. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // --- Renderizado de Pasos ---
  
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Información de Contacto</h2>
        <p className="text-gray-600">Comencemos con tus datos básicos</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre y Apellido *</label>
          <input {...register("nombre")} placeholder="Ej: Juan Pérez" className={`input-style ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input {...register("email")} placeholder="juan@empresa.cl" className={`input-style ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
          <input {...register("telefono")} placeholder="+56912345678" className={`input-style ${errors.telefono ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Datos del Proyecto</h2>
        <p className="text-gray-600">Cuéntanos sobre tu proyecto</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Servicio *</label>
          <select {...register("tipoServicio")} className={`input-style ${errors.tipoServicio ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Selecciona un servicio</option>
            {servicios.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.tipoServicio && <p className="text-red-500 text-sm mt-1">{errors.tipoServicio.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Edificio *</label>
          <select {...register("tipoEdificio")} className={`input-style ${errors.tipoEdificio ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Selecciona tipo</option>
            {tiposEdificio.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.tipoEdificio && <p className="text-red-500 text-sm mt-1">{errors.tipoEdificio.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Número de Pisos *</label>
          <input type="number" {...register("pisos")} placeholder="Ej: 10" className={`input-style ${errors.pisos ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.pisos && <p className="text-red-500 text-sm mt-1">{errors.pisos.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Metros Cuadrados *</label>
          <input type="number" {...register("metrosCuadrados")} placeholder="Ej: 500" className={`input-style ${errors.metrosCuadrados ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.metrosCuadrados && <p className="text-red-500 text-sm mt-1">{errors.metrosCuadrados.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Dirección del Proyecto *</label>
        <input {...register("direccion")} placeholder="Ej: Av. Providencia 1234, Providencia" className={`input-style ${errors.direccion ? 'border-red-500' : 'border-gray-300'}`} />
        {errors.direccion && <p className="text-red-500 text-sm mt-1">{errors.direccion.message}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
     <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Detalles Adicionales</h2>
        <p className="text-gray-600">Información final para tu cotización</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Estimada de Ejecución *</label>
          <input type="date" {...register("fechaEjecucion")} min={new Date().toISOString().split('T')[0]} className={`input-style ${errors.fechaEjecucion ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.fechaEjecucion && <p className="text-red-500 text-sm mt-1">{errors.fechaEjecucion.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Presupuesto Aproximado (Opcional)</label>
          <select {...register("presupuesto")} className="input-style border-gray-300">
            <option value="">Selecciona un rango</option>
            {rangosPresupuesto.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fotos del Área a Intervenir</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <label className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-500">Subir fotos</span>
                <input type="file" multiple accept="image/*" {...register("fotos")} className="hidden" />
              </label>
              <p className="text-gray-500 text-sm mt-1">PNG, JPG hasta 10MB</p>
            </div>
          </div>
          {fotos?.length > 0 && <p className="text-sm text-gray-600 mt-2">{fotos.length} foto(s) seleccionada(s)</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Comentarios Adicionales</label>
          <textarea {...register("comentarios")} rows={4} className="input-style border-gray-300" placeholder="Describe cualquier detalle específico..." />
        </div>
      </div>
    </div>
  );
  
  const renderStep4 = () => {
    const values = getValues();
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Resumen de tu Solicitud</h2>
          <p className="text-gray-600">Revisa los datos antes de enviar</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 border-b pb-1">Info. Personal</h3>
              <p><strong>Nombre:</strong> {values.nombre}</p>
              <p><strong>Email:</strong> {values.email}</p>
              <p><strong>Teléfono:</strong> {values.telefono}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 border-b pb-1">Detalles Proyecto</h3>
              <p><strong>Servicio:</strong> {values.tipoServicio}</p>
              <p><strong>Edificio:</strong> {values.tipoEdificio}</p>
              <p><strong>Pisos:</strong> {values.pisos}</p>
              <p><strong>M²:</strong> {values.metrosCuadrados}</p>
            </div>
          </div>
          <div className="text-sm">
            <h3 className="font-semibold text-gray-900 mb-2 border-b pb-1">Info. Adicional</h3>
            <p><strong>Dirección:</strong> {values.direccion}</p>
            <p><strong>Fecha Estimada:</strong> {values.fechaEjecucion}</p>
            {values.presupuesto && <p><strong>Presupuesto:</strong> {values.presupuesto}</p>}
            {values.fotos?.length > 0 && <p><strong>Fotos:</strong> {values.fotos.length} archivo(s)</p>}
            {values.comentarios && <p><strong>Comentarios:</strong> {values.comentarios}</p>}
          </div>
        </div>
        {error && <div className="text-red-600 bg-red-100 p-3 rounded text-center">{error}</div>}
      </div>
    );
  };
  
  const renderSuccess = () => (
    <div className="text-center space-y-6 py-10">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Solicitud Enviada!</h2>
        <p className="text-gray-600 mb-4 max-w-md mx-auto">
          Hemos recibido tu solicitud. Un ejecutivo te contactará dentro de las próximas 24 horas.
        </p>
        <div className="bg-blue-50 rounded-lg p-4 text-left max-w-sm mx-auto">
          <h3 className="font-semibold text-blue-900 mb-2">Próximos Pasos:</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>1. Revisaremos tu solicitud.</li>
            <li>2. Te contactaremos para agendar una visita si es necesario.</li>
            <li>3. Recibirás tu cotización detallada por email.</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const steps = [renderStep1, renderStep2, renderStep3, renderStep4, renderSuccess];

  return (
    <>
      {currentStep < 5 && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center w-full">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {step}
                </div>
                {step < 4 && <div className={`flex-1 h-1 mx-2 ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600 w-full px-1">
            <span className="w-1/4 text-center">Contacto</span>
            <span className="w-1/4 text-center">Proyecto</span>
            <span className="w-1/4 text-center">Detalles</span>
            <span className="w-1/4 text-center">Resumen</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          {steps[currentStep - 1]()}
        </form>
        
        {currentStep < 5 && (
          <div className={`flex mt-8 ${currentStep === 1 ? 'justify-end' : 'justify-between'}`}>
            {currentStep > 1 && (
              <button onClick={prevStep} className="flex items-center px-6 py-3 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </button>
            )}
            <button
              onClick={currentStep === 4 ? handleSubmit(onSubmit) : nextStep}
              disabled={loading}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {loading ? 'Enviando...' : (currentStep === 4 ? 'Enviar Solicitud' : 'Siguiente')}
              {!loading && currentStep !== 4 && <ChevronRight className="h-4 w-4 ml-2" />}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
