"use client";

import { useState } from "react";

interface BudgetFormProps {
  onSubmit: (data: { descripcion: string; iva_porcentaje: number }) => void;
  loading: boolean;
}

const EXAMPLE =
  "Reforma completa de baño de 8m2 en Andorra la Vella. Cambio de azulejos, plato de ducha, inodoro y lavabo. Calidades medias-altas. Incluir mano de obra.";

export default function BudgetForm({ onSubmit, loading }: BudgetFormProps) {
  const [descripcion, setDescripcion] = useState("");
  const [iva, setIva] = useState(4.5);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (descripcion.trim().length < 20) {
      setError("Describe la obra con al menos 20 caracteres");
      return;
    }
    setError("");
    onSubmit({ descripcion, iva_porcentaje: iva });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Descripción de la obra
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={5}
          placeholder="Describe la reforma o construcción con el máximo detalle posible: tipo de obra, dimensiones, materiales, ubicación, calidades deseadas..."
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition resize-none"
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        <button
          type="button"
          onClick={() => setDescripcion(EXAMPLE)}
          className="mt-2 text-xs text-blue-500 hover:text-blue-700 underline"
        >
          Usar ejemplo de baño
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Régimen fiscal / IVA
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Andorra", sublabel: "IGI 4.5%", value: 4.5 },
            { label: "España", sublabel: "IVA 21%", value: 21 },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setIva(opt.value)}
              className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm transition text-left ${
                iva === opt.value
                  ? "border-blue-500 ring-2 ring-blue-100 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-blue-400"
              }`}
            >
              <div>
                <span className="block text-sm font-semibold text-gray-800">{opt.label}</span>
                <span className="block text-xs text-gray-500">{opt.sublabel}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 px-6 py-4 text-white font-semibold text-sm shadow-md hover:bg-blue-700 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generando presupuesto con IA...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Generar Presupuesto con IA
          </>
        )}
      </button>
    </form>
  );
}
