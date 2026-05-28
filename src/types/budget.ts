import { z } from "zod";

export const PartidaSchema = z.object({
  nombre: z.string(),
  descripcion: z.string().optional().default(""),
  unidad: z.string(),
  cantidad: z.number(),
  precio_unitario: z.number(),
  total: z.number(),
  tipo: z.enum(["material", "mano_obra"]),
});

export const BudgetSchema = z.object({
  titulo: z.string(),
  descripcion_obra: z.string(),
  partidas: z.array(PartidaSchema),
  subtotal_materiales: z.number(),
  subtotal_mano_obra: z.number(),
  subtotal: z.number(),
  iva_porcentaje: z.number(),
  iva_importe: z.number(),
  total: z.number(),
  validez_dias: z.number().default(30),
  notas: z.array(z.string()).optional().default([]),
});

export type Partida = z.infer<typeof PartidaSchema>;
export type Budget = z.infer<typeof BudgetSchema>;

export interface EmpresaConfig {
  nombre: string;
  cif: string;
  direccion: string;
  telefono: string;
  email: string;
}

export const DEFAULT_EMPRESA: EmpresaConfig = {
  nombre: "Reformas & Construcción S.L.",
  cif: "A12345678",
  direccion: "Av. Meritxell 15, Andorra la Vella",
  telefono: "+376 800 000",
  email: "info@reformas-demo.ad",
};
