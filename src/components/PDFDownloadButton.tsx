"use client";

import { useState } from "react";
import { Budget, EmpresaConfig } from "@/types/budget";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Font,
} from "@react-pdf/renderer";

const fmt = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 9, color: "#1a1a2e" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  logoBox: { width: 44, height: 44, backgroundColor: "#1d4ed8", borderRadius: 8, justifyContent: "center", alignItems: "center" },
  logoText: { color: "white", fontSize: 14, fontFamily: "Helvetica-Bold" },
  companyName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#1d4ed8" },
  companyDetail: { fontSize: 7.5, color: "#6b7280", marginTop: 1 },
  docInfo: { alignItems: "flex-end" },
  docDate: { fontSize: 8, color: "#6b7280" },
  docDateVal: { fontSize: 8.5, fontFamily: "Helvetica-Bold" },
  titleBar: { backgroundColor: "#1d4ed8", borderRadius: 8, padding: "12 16", marginBottom: 16 },
  titleText: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "white" },
  subtitleText: { fontSize: 8.5, color: "#bfdbfe", marginTop: 3 },
  sectionHeader: { backgroundColor: "#eff6ff", padding: "6 10", marginBottom: 0, borderRadius: "4 4 0 0" },
  sectionTitle: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#1d4ed8" },
  table: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: "0 0 4 4", marginBottom: 12 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f9fafb", borderBottomWidth: 1, borderColor: "#e5e7eb" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#f3f4f6" },
  tableFooter: { flexDirection: "row", backgroundColor: "#f3f4f6" },
  col1: { flex: 3, padding: "5 8" },
  col2: { flex: 1, padding: "5 4", textAlign: "center" },
  col3: { flex: 1, padding: "5 4", textAlign: "right" },
  col4: { flex: 1.2, padding: "5 4", textAlign: "right" },
  col5: { flex: 1.4, padding: "5 8", textAlign: "right" },
  thText: { fontSize: 7, color: "#6b7280", textTransform: "uppercase" },
  tdPrimary: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#111827" },
  tdSecondary: { fontSize: 7, color: "#9ca3af", marginTop: 1 },
  tdNormal: { fontSize: 8, color: "#374151" },
  summaryBox: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 6, padding: 12, marginBottom: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  summaryLabel: { fontSize: 8.5, color: "#6b7280" },
  summaryValue: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#111827" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 2, borderColor: "#bfdbfe", paddingTop: 8, marginTop: 4 },
  totalLabel: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
  totalValue: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#1d4ed8" },
  notesBox: { backgroundColor: "#fffbeb", borderWidth: 1, borderColor: "#fde68a", borderRadius: 6, padding: 10, marginBottom: 12 },
  notesTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#92400e", marginBottom: 4 },
  noteText: { fontSize: 7.5, color: "#78350f", marginBottom: 2 },
  footer: { borderTopWidth: 1, borderColor: "#e5e7eb", paddingTop: 10, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7, color: "#9ca3af" },
});

function BudgetPDF({ budget, empresa }: { budget: Budget; empresa: EmpresaConfig }) {
  const today = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
  const validUntil = new Date(Date.now() + budget.validez_dias * 86400000).toLocaleDateString("es-ES", {
    day: "2-digit", month: "long", year: "numeric",
  });
  const materiales = budget.partidas.filter((p) => p.tipo === "material");
  const manoObra = budget.partidas.filter((p) => p.tipo === "mano_obra");
  const ivaLabel = budget.iva_porcentaje === 4.5 ? "IGI" : "IVA";

  const PartidaSection = ({ title, partidas }: { title: string; partidas: Budget["partidas"] }) => (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <View style={styles.col1}><Text style={styles.thText}>Partida</Text></View>
          <View style={styles.col2}><Text style={styles.thText}>Ud.</Text></View>
          <View style={styles.col3}><Text style={styles.thText}>Cant.</Text></View>
          <View style={styles.col4}><Text style={styles.thText}>Precio/Ud.</Text></View>
          <View style={styles.col5}><Text style={styles.thText}>Total</Text></View>
        </View>
        {partidas.map((p, i) => (
          <View key={i} style={styles.tableRow}>
            <View style={styles.col1}>
              <Text style={styles.tdPrimary}>{p.nombre}</Text>
              {p.descripcion && <Text style={styles.tdSecondary}>{p.descripcion}</Text>}
            </View>
            <View style={styles.col2}><Text style={styles.tdNormal}>{p.unidad}</Text></View>
            <View style={styles.col3}><Text style={styles.tdNormal}>{p.cantidad}</Text></View>
            <View style={styles.col4}><Text style={styles.tdNormal}>{fmt(p.precio_unitario)}</Text></View>
            <View style={styles.col5}><Text style={[styles.tdNormal, { fontFamily: "Helvetica-Bold" }]}>{fmt(p.total)}</Text></View>
          </View>
        ))}
        <View style={styles.tableFooter}>
          <View style={[styles.col1, { flex: 5.2 }]}>
            <Text style={[styles.tdNormal, { fontFamily: "Helvetica-Bold" }]}>Subtotal {title}</Text>
          </View>
          <View style={styles.col5}>
            <Text style={[styles.tdNormal, { fontFamily: "Helvetica-Bold" }]}>
              {fmt(partidas.reduce((s, p) => s + p.total, 0))}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
            <View style={styles.logoBox}><Text style={styles.logoText}>RC</Text></View>
            <View>
              <Text style={styles.companyName}>{empresa.nombre}</Text>
              <Text style={styles.companyDetail}>{empresa.cif}</Text>
              <Text style={styles.companyDetail}>{empresa.direccion}</Text>
              <Text style={styles.companyDetail}>{empresa.telefono} · {empresa.email}</Text>
            </View>
          </View>
          <View style={styles.docInfo}>
            <Text style={styles.docDate}>Fecha de emisión</Text>
            <Text style={styles.docDateVal}>{today}</Text>
            <Text style={[styles.docDate, { marginTop: 6 }]}>Válido hasta</Text>
            <Text style={styles.docDateVal}>{validUntil}</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleBar}>
          <Text style={styles.titleText}>{budget.titulo}</Text>
          <Text style={styles.subtitleText}>{budget.descripcion_obra}</Text>
        </View>

        {/* Partidas */}
        {materiales.length > 0 && <PartidaSection title="Materiales" partidas={materiales} />}
        {manoObra.length > 0 && <PartidaSection title="Mano de Obra" partidas={manoObra} />}

        {/* Resumen */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal materiales</Text>
            <Text style={styles.summaryValue}>{fmt(budget.subtotal_materiales)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal mano de obra</Text>
            <Text style={styles.summaryValue}>{fmt(budget.subtotal_mano_obra)}</Text>
          </View>
          <View style={[styles.summaryRow, { borderTopWidth: 1, borderColor: "#e5e7eb", paddingTop: 5, marginTop: 3 }]}>
            <Text style={styles.summaryLabel}>Base imponible</Text>
            <Text style={styles.summaryValue}>{fmt(budget.subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{ivaLabel} {budget.iva_porcentaje}%</Text>
            <Text style={styles.summaryValue}>{fmt(budget.iva_importe)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>{fmt(budget.total)}</Text>
          </View>
        </View>

        {/* Notas */}
        {budget.notas && budget.notas.length > 0 && (
          <View style={styles.notesBox}>
            <Text style={styles.notesTitle}>Notas y condiciones</Text>
            {budget.notas.map((n, i) => (
              <Text key={i} style={styles.noteText}>• {n}</Text>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{empresa.nombre} · {empresa.cif}</Text>
          <Text style={styles.footerText}>Presupuesto generado con IA · Válido {budget.validez_dias} días</Text>
          <Text style={styles.footerText}>{empresa.email}</Text>
        </View>
      </Page>
    </Document>
  );
}

export default function PDFDownloadButton({ budget, empresa }: { budget: Budget; empresa: EmpresaConfig }) {
  const safeTitle = budget.titulo.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "presupuesto";
  const filename = `presupuesto-${safeTitle}.pdf`;

  return (
    <PDFDownloadLink
      document={<BudgetPDF budget={budget} empresa={empresa} />}
      fileName={filename}
      style={{ flex: 1, textDecoration: "none" }}
    >
      {({ loading: pdfLoading }) => (
        <span
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            backgroundColor: pdfLoading ? "#15803d" : "#16a34a",
            color: "white", borderRadius: "12px", padding: "12px 16px",
            fontSize: "14px", fontWeight: "600", cursor: "pointer", width: "100%",
          }}
        >
          {pdfLoading ? "Preparando PDF..." : (
            <>
              <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar PDF
            </>
          )}
        </span>
      )}
    </PDFDownloadLink>
  );
}
