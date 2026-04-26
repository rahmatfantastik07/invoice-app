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

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    // 🔥 GANTI KE PORTRAIT
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210;
    const pageHeight = 297;

    const margin = 15;

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    let renderWidth = maxWidth;
    let renderHeight = (imgHeight * maxWidth) / imgWidth;

    // 🔥 JAGA AGAR TIDAK TERPOTONG
    if (renderHeight > maxHeight) {
      renderHeight = maxHeight;
      renderWidth = (imgWidth * maxHeight) / imgHeight;
    }

    const x = (pageWidth - renderWidth) / 2;
    const y = margin; // 🔥 jangan center vertikal → biar natural seperti dokumen

    pdf.addImage(imgData, "PNG", x, y, renderWidth, renderHeight);

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

      {/* INVOICE WRAPPER (RESPONSIVE FIX) */}
      <div className="preview-wrapper">
        <div className="preview-scale">

          <div
            ref={printRef}
            className="invoice-paper"
          >

            {/* HEADER */}
            <div className="flex justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold">INVOICE</h1>
                <p>{data.invoiceNumber || "-"}</p>
                <p>Tanggal: {formatTanggal(data.date)}</p>
                <p>Jatuh Tempo: {formatTanggal(data.dueDate)}</p>
              </div>

              <div className="text-right">
                {data.logo && (
                  <img
                    src={data.logo}
                    className="logo"
                  />
                )}

                <p className="font-bold">{data.from?.name || "-"}</p>
                <p>{data.from?.address || "-"}</p>
                <p>{data.from?.phone || "-"}</p>
                <p>{data.from?.email || "-"}</p>
              </div>
            </div>

            {/* CLIENT */}
            <div className="mb-4">
              <p className="font-bold">Kepada:</p>
              <p>{data.to?.name || "-"}</p>
              <p>{data.to?.address || "-"}</p>
              <p>{data.to?.phone || "-"}</p>
              <p>{data.to?.email || "-"}</p>
              <p>
                {(data.to?.fromCity || "-")} → {(data.to?.toCity || "-")}
              </p>
            </div>

            {/* TABLE */}
            <table className="preview-table">
              <thead>
                <tr>
                  <th>Deskripsi</th>
                  <th>Qty</th>
                  <th>Harga</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(data.items || []).map((item: any, i: number) => (
                  <tr key={i}>
                    <td>{item.desc || "-"}</td>
                    <td className="text-center">{item.qty || 0}</td>
                    <td>{formatRupiah(item.price || 0)}</td>
                    <td>
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
                <img src={data.qris} className="qris" />
              )}

              {data.signature && (
                <div className="text-center">
                  <p>Hormat Kami,</p>
                  <img
                    src={data.signature}
                    className="signature"
                  />
                  <p>{data.from?.name || "-"}</p>
                </div>
              )}
            </div>

            {/* FOOTNOTE */}
            <div className="footnote">
              <p>Terima kasih atas kepercayaan Anda 🙏</p>
              <p>Dibuat oleh: {data.from?.name || "-"}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
