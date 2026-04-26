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
  const element = printRef.current;
  if (!element) return;

  // 🔥 CLONE (KUNCI UTAMA)
  const clone = element.cloneNode(true) as HTMLElement;

  clone.style.width = "297mm";
  clone.style.minHeight = "210mm";
  clone.style.transform = "scale(1)";
  clone.style.position = "fixed";
  clone.style.top = "0";
  clone.style.left = "0";
  clone.style.zIndex = "-1";
  clone.style.background = "#fff";

  document.body.appendChild(clone);

  const canvas = await html2canvas(clone, {
    scale: 2, // 🔥 konsisten semua device
    useCORS: true,
    backgroundColor: "#ffffff",
    windowWidth: clone.scrollWidth,
    windowHeight: clone.scrollHeight,
  });

  document.body.removeChild(clone);

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 297;
  const pageHeight = 210;

  pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

  pdf.save(`${data.invoiceNumber || "invoice"}.pdf`);
};

  return (
    <div className="w-full">

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
                gridTemplateColumns: "60% 40%",
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
                  <p>{data.to?.name || "-"}</p>
                  <p>{data.to?.address || "-"}</p>
                  <p>{data.to?.phone || "-"}</p>
                  <p>{data.to?.email || "-"}</p>
                  <p>
                    dari {(data.to?.fromCity || "-")} ke {(data.to?.toCity || "-")}
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
            <table className="w-full border table-fixed">
              <thead>
                <tr style={{ background: "#e5e7eb" }}>
                  <th className="border p-2">Deskripsi</th>
                  <th className="border p-2 w-16">Qty</th>
                  <th className="border p-2 w-28">Harga</th>
                  <th className="border p-2 w-28">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(data.items || []).map((item: any, i: number) => (
                  <tr key={i}>
                    <td className="border p-2 wrap-break-word">
                      {item.desc || "-"}
                    </td>
                    <td className="border p-2 text-center">
                      {item.qty || 0}
                    </td>
                    <td className="border p-2">
                      {formatRupiah(item.price || 0)}
                    </td>
                    <td className="border p-2">
                      {formatRupiah(
                        (item.qty || 0) * (item.price || 0)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TOTAL */}
            <h3 className="text-right mt-4 font-bold">
              TOTAL: {formatRupiah(total)}
            </h3>

            {/* NOTES */}
            <div className="mt-6">
              <p className="font-bold">Catatan:</p>
              <p>{data.notes || "-"}</p>
            </div>

            {/* FOOTER */}
            <div className="flex justify-between mt-10 items-end">
              {data.qris && (
                <img
                  src={data.qris}
                  className="h-24 object-contain"
                />
              )}

              {data.signature && (
                <div className="text-center">
                  <p>Hormat Kami,</p>
                  <img
                    src={data.signature}
                    className="h-20 mx-auto object-contain"
                  />
                  <p>{data.from?.name || "-"}</p>
                </div>
              )}
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
