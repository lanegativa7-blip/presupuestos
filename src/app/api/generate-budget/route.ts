import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { BudgetSchema } from "@/types/budget";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY no configurada. Añádela a .env.local" },
      { status: 500 }
    );
  }

  const { descripcion, iva_porcentaje } = await req.json();

  const iva = Number(iva_porcentaje) || 4.5;

  if (!descripcion?.trim()) {
    return NextResponse.json({ error: "La descripción es obligatoria" }, { status: 400 });
  }

  const ivaLabel = iva === 4.5 ? "IGI andorrano 4.5%" : "IVA español 21%";

  const prompt = `Eres un experto en presupuestos de reformas y construcción en Andorra y España con 20 años de experiencia.

Genera un presupuesto profesional y detallado para esta obra:
"${descripcion}"

IMPUESTO APLICABLE: ${ivaLabel} — usa EXACTAMENTE ${iva}% como iva_porcentaje en el JSON, sin excepciones.

IMPORTANTE: Responde ÚNICAMENTE con JSON válido, sin texto adicional, sin markdown, sin explicaciones. Solo el JSON.

Usa exactamente esta estructura:
{
  "titulo": "Presupuesto [tipo de obra] - [ubicación si se menciona]",
  "descripcion_obra": "Descripción resumida de la obra en 1-2 frases",
  "partidas": [
    {
      "nombre": "Nombre de la partida",
      "descripcion": "Descripción breve de los trabajos incluidos",
      "unidad": "m2",
      "cantidad": 8.0,
      "precio_unitario": 45.00,
      "total": 360.00,
      "tipo": "mano_obra"
    }
  ],
  "subtotal_materiales": 2400.00,
  "subtotal_mano_obra": 1800.00,
  "subtotal": 4200.00,
  "iva_porcentaje": ${iva},
  "iva_importe": ${(4200 * iva / 100).toFixed(2)},
  "total": ${(4200 * (1 + iva / 100)).toFixed(2)},
  "validez_dias": 30,
  "notas": ["Los precios incluyen desplazamiento", "Materiales de calidad media-alta"]
}

Reglas:
- Incluye entre 6 y 12 partidas detalladas y realistas
- Usa precios del mercado actual (2024) en euros para Andorra/España
- Cada "total" debe ser cantidad × precio_unitario
- subtotal = subtotal_materiales + subtotal_mano_obra
- iva_porcentaje DEBE ser exactamente ${iva}
- iva_importe = subtotal × ${iva} / 100
- total = subtotal + iva_importe
- tipo debe ser "material" o "mano_obra"`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      throw new Error("No se encontró JSON en la respuesta");
    }

    const raw = JSON.parse(text.slice(jsonStart, jsonEnd + 1));

    // Recalcular todos los totales desde las partidas — nunca confiar en los números de Claude
    const round2 = (n: number) => Math.round(n * 100) / 100;

    for (const p of raw.partidas) {
      p.total = round2(p.cantidad * p.precio_unitario);
    }

    raw.subtotal_materiales = round2(
      raw.partidas.filter((p: { tipo: string }) => p.tipo === "material").reduce((s: number, p: { total: number }) => s + p.total, 0)
    );
    raw.subtotal_mano_obra = round2(
      raw.partidas.filter((p: { tipo: string }) => p.tipo === "mano_obra").reduce((s: number, p: { total: number }) => s + p.total, 0)
    );
    raw.subtotal = round2(raw.subtotal_materiales + raw.subtotal_mano_obra);
    raw.iva_porcentaje = iva;
    raw.iva_importe = round2(raw.subtotal * iva / 100);
    raw.total = round2(raw.subtotal + raw.iva_importe);

    const budget = BudgetSchema.parse(raw);

    return NextResponse.json(budget);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: `Error generando presupuesto: ${message}` }, { status: 500 });
  }
}
