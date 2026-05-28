"use client";

import { Budget, DEFAULT_EMPRESA } from "@/types/budget";
import dynamic from "next/dynamic";

const PDFDownloadButton = dynamic(() => import("./PDFDownloadButton"), { ssr: false });

const fmt = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

interface Props {
  budget: Budget;
  onReset: () => void;
}

export default function BudgetResult({ budget, onReset }: Props) {
  const empresa = DEFAULT_EMPRESA;
  const today = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
  const validUntil = new Date(Date.now() + budget.validez_dias * 86400000).toLocaleDateString("es-ES", {
    day: "2-digit", month: "long", year: "numeric",
  });

  const materiales = budget.partidas.filter((p) => p.tipo === "material");
  const manoObra = budget.partidas.filter((p) => p.tipo === "mano_obra");

  return (
    <div className="space-y-6">
      {/* Header del presupuesto */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-xs font-bold">RC</div>
              <span className="text-sm font-medium text-blue-100">{empresa.nombre}</span>
            </div>
            <h2 className="text-xl font-bold mt-2">{budget.titulo}</h2>
            <p className="text-blue-100 text-sm mt-1">{budget.descripcion_obra}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-blue-200">Fecha</div>
            <div className="text-sm font-semibold">{today}</div>
            <div className="text-xs text-blue-200 mt-2">Válido hasta</div>
            <div className="text-sm font-semibold">{validUntil}</div>
          </div>
        </div>
      </div>

      {/* Tabla de partidas - Materiales */}
      {materiales.length > 0 && (
        <PartidaTable title="Materiales" partidas={materiales} color="blue" />
      )}

      {/* Tabla de partidas - Mano de obra */}
      {manoObra.length > 0 && (
        <PartidaTable title="Mano de Obra" partidas={manoObra} color="amber" />
      )}

      {/* Resumen económico */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Resumen Económico</h3>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal materiales</span>
            <span className="font-medium text-gray-800">{fmt(budget.subtotal_materiales)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal mano de obra</span>
            <span className="font-medium text-gray-800">{fmt(budget.subtotal_mano_obra)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-gray-800 pt-2 border-t border-gray-100">
            <span>Base imponible</span>
            <span>{fmt(budget.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{budget.iva_porcentaje === 4.5 ? "IGI" : "IVA"} {budget.iva_porcentaje}%</span>
            <span className="font-medium text-gray-800">{fmt(budget.iva_importe)}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t-2 border-blue-100">
            <span className="text-lg font-bold text-gray-900">TOTAL</span>
            <span className="text-2xl font-bold text-blue-700">{fmt(budget.total)}</span>
          </div>
        </div>
      </div>

      {/* Notas */}
      {budget.notas && budget.notas.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-amber-800 mb-2">Notas y condiciones</h4>
          <ul className="space-y-1">
            {budget.notas.map((nota, i) => (
              <li key={i} className="text-xs text-amber-700 flex gap-2">
                <span>•</span>
                <span>{nota}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-3">
        <PDFDownloadButton budget={budget} empresa={empresa} />
        <button
          onClick={onReset}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Nuevo presupuesto
        </button>
      </div>
    </div>
  );
}

function PartidaTable({
  title,
  partidas,
  color,
}: {
  title: string;
  partidas: Budget["partidas"];
  color: "blue" | "amber";
}) {
  const fmt = (n: number) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

  const headerClass =
    color === "blue"
      ? "bg-blue-50 text-blue-700"
      : "bg-amber-50 text-amber-700";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className={`px-6 py-3 ${headerClass}`}>
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-6 py-3 text-left font-medium">Partida</th>
              <th className="px-4 py-3 text-center font-medium">Ud.</th>
              <th className="px-4 py-3 text-right font-medium">Cant.</th>
              <th className="px-4 py-3 text-right font-medium">Precio/Ud.</th>
              <th className="px-6 py-3 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {partidas.map((p, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{p.nombre}</div>
                  {p.descripcion && (
                    <div className="text-xs text-gray-400 mt-0.5">{p.descripcion}</div>
                  )}
                </td>
                <td className="px-4 py-4 text-center text-gray-500">{p.unidad}</td>
                <td className="px-4 py-4 text-right text-gray-700">{p.cantidad}</td>
                <td className="px-4 py-4 text-right text-gray-700">{fmt(p.precio_unitario)}</td>
                <td className="px-6 py-4 text-right font-semibold text-gray-900">{fmt(p.total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 bg-gray-50">
              <td colSpan={4} className="px-6 py-3 text-sm font-semibold text-gray-700">
                Subtotal {title}
              </td>
              <td className="px-6 py-3 text-right font-bold text-gray-900">
                {fmt(partidas.reduce((s, p) => s + p.total, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
