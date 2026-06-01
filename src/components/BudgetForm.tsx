"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const FormSchema = z.object({
  descripcion: z.string().min(20, "Describe la obra con al menos 20 caracteres"),
  iva_porcentaje: z.number(),
});

type FormValues = z.infer<typeof FormSchema>;

interface BudgetFormProps {
  onSubmit: (data: FormValues) => void;
  loading: boolean;
}

const EXAMPLE =
  "Reforma completa de baño de 8m2 en Andorra la Vella. Cambio de azulejos, plato de ducha, inodoro y lavabo. Calidades medias-altas. Incluir mano de obra.";

export default function BudgetForm({ onSubmit, loading }: BudgetFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { iva_porcentaje: 4.5 },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Descripción de la obra
        </label>
        <textarea
          {...register("descripcion")}
          rows={5}
          placeholder="Describe la reforma o construcción con el máximo detalle posible: tipo de obra, dimensiones, materiales, ubicación, calidades deseadas..."
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition resize-none"
        />
        {errors.descripcion && (
          <p className="mt-1 text-xs text-red-500">{errors.descripcion.message}</p>
        )}
        <button
          type="button"
          onClick={() => setValue("descripcion", EXAMPLE)}
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
            <label
              key={opt.value}
              className="relative flex cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-blue-400 transition has-[:checked]:border-blue-500 has-[:checked]:ring-2 has-[:checked]:ring-blue-100"
            >
              <input
                type="radio"
                value={String(opt.value)}
                {...register("iva_porcentaje", { valueAsNumber: true })}
                defaultChecked={opt.value === 4.5}
                className="sr-only"
              />
              <div>
                <span className="block text-sm font-semibold text-gray-800">{opt.label}</span>
                <span className="block text-xs text-gray-500">{opt.sublabel}</span>
              </div>
            </label>
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
