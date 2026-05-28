"use client";

import { useState } from "react";
import BudgetForm from "@/components/BudgetForm";
import BudgetResult from "@/components/BudgetResult";
import { Budget } from "@/types/budget";

export default function Home() {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: { descripcion: string; iva_porcentaje: number }) {
    setLoading(true);
    setError(null);
    setBudget(null);

    try {
      const res = await fetch("/api/generate-budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Error generando presupuesto");
      }

      setBudget(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Nav */}
      <nav className="border-b border-white/60 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow">
              RC
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm">PresupuestosAI</span>
              <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-medium">Beta</span>
            </div>
          </div>
          <span className="text-xs text-gray-400">Generador de presupuestos con IA · Andorra & España</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {!budget ? (
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left: form */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  Genera presupuestos de obra{" "}
                  <span className="text-blue-600">en segundos</span>
                </h1>
                <p className="mt-3 text-gray-500 text-base">
                  Describe la reforma o construcción y nuestra IA generará un presupuesto detallado y profesional listo para entregar al cliente.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <BudgetForm onSubmit={handleSubmit} loading={loading} />
              </div>
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}
            </div>

            {/* Right: features */}
            <div className="lg:col-span-2 space-y-4">
              {[
                {
                  icon: "⚡",
                  title: "Generación en < 30s",
                  desc: "Tecnología Claude AI para presupuestos precisos al instante",
                },
                {
                  icon: "📋",
                  title: "Partidas detalladas",
                  desc: "Desglose completo de materiales, mano de obra e impuestos",
                },
                {
                  icon: "🇦🇩",
                  title: "Andorra & España",
                  desc: "IGI 4.5% o IVA 21% según el mercado de tu cliente",
                },
                {
                  icon: "📄",
                  title: "PDF profesional",
                  desc: "Documento listo para imprimir y entregar al cliente",
                },
              ].map((f) => (
                <div key={f.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4">
                  <div className="text-2xl">{f.icon}</div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{f.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Presupuesto generado</h2>
                <p className="text-xs text-gray-500">Revisa los detalles y descarga el PDF cuando estés listo</p>
              </div>
            </div>
            <BudgetResult budget={budget} onReset={() => setBudget(null)} />
          </div>
        )}
      </main>

      <footer className="border-t border-gray-100 mt-20 py-8 text-center">
        <p className="text-xs text-gray-400">
          PresupuestosAI · Demo · Powered by Claude AI
        </p>
      </footer>
    </div>
  );
}
