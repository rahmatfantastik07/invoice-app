"use client";

import { formatRupiah, formatTanggal } from "./utils";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function InvoicePreview({ data }: any) {
  const printRef = useRef<HTMLDivElement>(null);

  const total = (data.items || []).reduce(
    (sum: number, item: any) =>
      sum + (item.qty || 0) * (item.price || 0),
    0
  );

const handleDownloadPDF = async () => {
  try {
    const element = printRef.current;
    if (!element) return;

    // 🔥 CLONE BIAR TIDAK TERPENGARUH RESPONSIVE / SCALE
    const clone = element.cloneNode(true) as HTMLElement;

    clone.style.width = "1122px";     // 🔥 paksa A4 landscape
    clone.style.minHeight = "794px";
    clone.style.transform = "scale(1)";
    clone.style.background = "#fff";

    // 🔥 taruh di luar layar (aman mobile)
    const wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.top = "-99999px";
    wrapper.style.left = "-99999px";

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",

      // 🔥 FIX COLOR ERROR (lab / oklch)
      onclone: (doc) => {
        doc.querySelectorAll("*").forEach((el: any) => {
          const style = window.getComputedStyle(el);

          if (style.color.includes("lab") || style.color.includes("oklch")) {
            el.style.color = "#000";
          }
          if (style.backgroundColor.includes("lab") || style.backgroundColor.includes("oklch")) {
            el.style.backgroundColor = "#fff";
          }
          if (style.borderColor.includes("lab") || style.borderColor.includes("oklch")) {
            el.style.borderColor = "#ccc";
          }
        });
      },
    });

    document.body.removeChild(wrapper);

    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    pdf.addImage(imgData, "JPEG", 0, 0, 297, 210);

    pdf.save(`${data.invoiceNumber || "invoice"}.pdf`);

  } catch (err) {
    console.error("PDF ERROR FINAL:", err);
    alert("Gagal download PDF (render gagal di device ini)");
  }
};

  return (
    <div className="w-full" style={{
  width: "1122px",
  minHeight: "794px",
  padding: "40px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between", // 🔥 KUNCI
}}>

      {/* BUTTON */}
      <div className="mb-2">
        <button onClick={handleDownloadPDF} className="btn">
          📄 Download PDF
        </button>
      </div>

      <div className="preview-wrapper preview-page">
        <div className="preview-scale">

          <div
            ref={printRef}
            style={{
              width: "297mm",
              minHeight: "210mm",
              padding: "10mm",
              paddingBottom: "20mm",
              boxSizing: "border-box",
              background: "#ffffff",
              fontFamily: "Arial, sans-serif",
            }}
            className="invoice-print"
          >

            {/* ================= HEADER (FIX PRESISI) ================= */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                alignItems: "start",
                marginBottom: "20px",
              }}
            >

              {/* KIRI */}
              <div>
                <h1 className="text-xl font-bold">INVOICE</h1>
                <p>{data.invoiceNumber || "-"}</p>
                <p>Tanggal: {formatTanggal(data.date)}</p>
                <p>Jatuh Tempo: {formatTanggal(data.dueDate)}</p>

                <div style={{ marginTop: "16px" }}>
                  <p className="font-bold">Kepada:</p>
                  <strong><p className="text-blue-950">{data.to?.name || "-"}</p></strong>
                  <p>{data.to?.address || "-"}</p>
                  <p>{data.to?.phone || "-"}</p>
                  <p>{data.to?.email || "-"}</p>
                  <p>
                    dari <strong className="text-blue-950">{(data.to?.fromCity || "-")}</strong> ke <strong className="text-blue-950">{(data.to?.toCity || "-")}</strong>
                  </p>
                </div>
              </div>

              {/* KANAN */}
              <div style={{ textAlign: "right" }}>
                {data.logo && (
                  <img
                    src={data.logo}
                    style={{
                      height: "50px",
                      marginBottom: "6px",
                      objectFit: "contain",
                      marginLeft: "auto",
                    }}
                  />
                )}

                <p className="font-bold">{data.from?.name || "-"}</p>
                <p>{data.from?.address || "-"}</p>
                <p>{data.from?.phone || "-"}</p>
                <p>{data.from?.email || "-"}</p>
              </div>

            </div>

            {/* TABLE */}
{/* TABLE */}
<table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "auto",
    fontSize: "12px",
  }}
>
  <thead>
    <tr style={{ background: "#e5e7eb" }}>
      <th style={{ border: "1px solid #ccc", padding: "6px", textAlign: "left" }}>
        Deskripsi
      </th>
      <th style={{ border: "1px solid #ccc", padding: "6px", width: "60px", textAlign: "center" }}>
        Qty
      </th>
      <th style={{ border: "1px solid #ccc", padding: "6px", width: "120px", textAlign: "right" }}>
        Harga
      </th>
      <th style={{ border: "1px solid #ccc", padding: "6px", width: "140px", textAlign: "right" }}>
        Subtotal
      </th>
    </tr>
  </thead>

  <tbody>
    {(data.items || []).map((item: any, i: number) => (
      <tr key={i}>
        <td
          style={{
            border: "1px solid #ccc",
            padding: "6px",
            wordBreak: "break-word",
          }}
        >
          {item.desc || "-"}
        </td>

        <td
          style={{
            border: "1px solid #ccc",
            padding: "6px",
            textAlign: "center",
          }}
        >
          {item.qty || 0}
        </td>

        <td
          style={{
            border: "1px solid #ccc",
            padding: "6px",
            textAlign: "right",
          }}
        >
          {formatRupiah(item.price || 0)}
        </td>

        <td
          style={{
            border: "1px solid #ccc",
            padding: "6px",
            textAlign: "right",
          }}
        >
          {formatRupiah(
            (item.qty || 0) * (item.price || 0)
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>

            {/* TOTAL */}
            <h3
  style={{
    textAlign: "right",
    marginTop: "20px",
    fontWeight: "bold",
  }}
>
  TOTAL: {formatRupiah(total)}
</h3>

            {/* NOTES */}
            <div className="mt-6">
              <p className="font-bold">Catatan:</p>
              <p>{data.notes || "-"}</p>
            </div>

            {/* FOOTER */}
           <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    marginTop: "40px",
    alignItems: "flex-end",
  }}
>

  {/* KIRI (QRIS) */}
  <div>
    {data.qris && (
      <img
        src={data.qris}
        style={{ height: "90px", objectFit: "contain" }}
      />
    )}
  </div>

  {/* KANAN (TTD) */}
  <div style={{ textAlign: "center", width: "200px" }}>
    <p>Hormat Kami,</p>

    {data.signature && (
      <img
        src={data.signature}
        style={{
          height: "80px",
          objectFit: "contain",
          margin: "8px auto",
          display: "block",
        }}
      />
    )}

    <p>{data.from?.name || "-"}</p>
  </div>

</div>

            {/* FOOTNOTE */}
            <div
              style={{
                marginTop: "15px",
                fontSize: "8px",
                textAlign: "center",
              }}
            >
              <p>Terima kasih atas kepercayaan Anda 🙏</p>
              <p>Dibuat oleh: {data.from?.name || "-"}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
