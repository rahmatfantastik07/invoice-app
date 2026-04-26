"use client";

import { useState, useEffect } from "react";
import InvoicePreview from "./InvoicePreview";
import { generateInvoiceNumber } from "./utils";

export default function InvoiceForm() {
  const [data, setData] = useState<any>({
    invoiceNumber: "",
    date: "",
    dueDate: "",
    from: {
      name: "CV. Family Target",
      address: "",
      phone: "",
      email: "",
    },
    to: {
      name: "",
      address: "",
      phone: "",
      email: "",
      fromCity: "",
      toCity: "",
    },
    items: [{ desc: "", qty: 1, price: 0 }],
    notes: "",
    signature: "",
    qris: "",
    logo: "", // ✅ TAMBAHAN
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    setData((prev: any) => ({
      ...prev,
      invoiceNumber: prev.invoiceNumber || generateInvoiceNumber(),
      date: prev.date || today,
      dueDate: prev.dueDate || today,
    }));
  }, []);

  const updateItem = (i: number, field: string, value: any) => {
    const items = [...data.items];
    items[i][field] = value;
    setData({ ...data, items });
  };

  const addItem = () => {
    setData({
      ...data,
      items: [...data.items, { desc: "", qty: 1, price: 0 }],
    });
  };

  // 🔥 SUPPORT LOGO JUGA
  const handleFile = (
    e: any,
    type: "signature" | "qris" | "logo"
  ) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setData((prev: any) => ({
        ...prev,
        [type]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const validatePhone = (value: string) => {
  // hanya angka
  const clean = value.replace(/\D/g, "");

  // harus diawali 62
  if (!clean.startsWith("62")) return false;

  // maksimal 13 digit
  if (clean.length > 13) return false;

  return true;
};

const [errors, setErrors] = useState<any>({});

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-350">

      {/* ================= FORM ================= */}
      <div className="bg-white p-4 rounded shadow space-y-3">

        {/* NOMOR */}
        <h2 className="font-bold">Nomor Invoice</h2>
        <input
          className="input"
          value={data.invoiceNumber}
          onChange={(e) =>
            setData({ ...data, invoiceNumber: e.target.value })
          }
        />

        {/* TANGGAL */}
        <h2 className="font-bold">Tanggal</h2>
        <div className="flex gap-2">
          <input
            type="date"
            className="input"
            value={data.date}
            onChange={(e) =>
              setData({ ...data, date: e.target.value })
            }
          />
          <input
            type="date"
            className="input"
            value={data.dueDate}
            onChange={(e) =>
              setData({ ...data, dueDate: e.target.value })
            }
          />
        </div>

        {/* PENGIRIM */}
        <h2 className="font-bold">Pengirim</h2>

        {/* 🔥 UPLOAD LOGO */}
        <p className="font-semibold">Upload Logo</p>
        <input
          type="file" className="btn2"
          onChange={(e) => handleFile(e, "logo")}
        />

        <input
          className="input"
          placeholder="Nama"
          value={data.from.name}
          onChange={(e) =>
            setData({
              ...data,
              from: { ...data.from, name: e.target.value },
            })
          }
        />
        <input
          className="input"
          placeholder="Alamat"
          onChange={(e) =>
            setData({
              ...data,
              from: { ...data.from, address: e.target.value },
            })
          }
        />
       <input
  className="input"
  placeholder="HP (08xxxxxxxxxxx)"
  value={data.from.phone}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");
    setData({
      ...data,
      from: { ...data.from, phone: value },
    });

    setErrors({
      ...errors,
      fromPhone: validatePhone(value) ? "" : "Format harus 08 dan max 12 digit",
    });
  }}
/>

{errors.fromPhone && (
  <p style={{ color: "red", fontSize: "12px" }}>
    {errors.fromPhone}
  </p>
)}
        <input
          className="input"
          placeholder="Email"
          onChange={(e) =>
            setData({
              ...data,
              from: { ...data.from, email: e.target.value },
            })
          }
        />

        {/* PENERIMA */}
        <h2 className="font-bold">Penerima</h2>
        <input
          className="input"
          placeholder="Nama"
          onChange={(e) =>
            setData({
              ...data,
              to: { ...data.to, name: e.target.value },
            })
          }
        />
        <input
          className="input"
          placeholder="Alamat"
          onChange={(e) =>
            setData({
              ...data,
              to: { ...data.to, address: e.target.value },
            })
          }
        />
 <input
  className="input"
  placeholder="HP (08xxxxxxxxxxx)"
  value={data.from.phone}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");
    setData({
      ...data,
      from: { ...data.from, phone: value },
    });

    setErrors({
      ...errors,
      fromPhone: validatePhone(value) ? "" : "Format harus 08 dan max 12 digit",
    });
  }}
/>

{errors.fromPhone && (
  <p style={{ color: "red", fontSize: "12px" }}>
    {errors.fromPhone}
  </p>
)}
        <input
          className="input"
          placeholder="Email"
          onChange={(e) =>
            setData({
              ...data,
              to: { ...data.to, email: e.target.value },
            })
          }
        />

        <div className="flex gap-2">
          <input
            className="input"
            placeholder="Dari Kota"
            onChange={(e) =>
              setData({
                ...data,
                to: { ...data.to, fromCity: e.target.value },
              })
            }
          />
          <input
            className="input"
            placeholder="Ke Kota"
            onChange={(e) =>
              setData({
                ...data,
                to: { ...data.to, toCity: e.target.value },
              })
            }
          />
        </div>

        {/* ITEM */}
        <h2 className="font-bold">Tambah Item</h2>
        {data.items.map((item: any, i: number) => (
          <div key={i}>
            <input
              className="input"
              placeholder="Deskripsi"
              onChange={(e) =>
                updateItem(i, "desc", e.target.value)
              }
            />
            <div className="flex gap-2">
              <input
                type="number"
                className="input"
                placeholder="Qty"
                onChange={(e) =>
                  updateItem(i, "qty", +e.target.value)
                }
              />
              <input
                type="number"
                className="input"
                placeholder="Harga"
                onChange={(e) =>
                  updateItem(i, "price", +e.target.value)
                }
              />
            </div>
          </div>
        ))}

        <button onClick={addItem} className="btn">
          + Item
        </button>

        {/* NOTES */}
        <textarea
          className="input"
          placeholder="Catatan"
          onChange={(e) =>
            setData({ ...data, notes: e.target.value })
          }
        />

        {/* FILE */}
        <p className="font-semibold">Upload Tanda Tangan</p>
        <input
          type="file" className="btn2"
          onChange={(e) => handleFile(e, "signature")}
        />

        <p className="font-semibold">Upload QRIS</p>
        <input
          type="file" className="btn2"
          onChange={(e) => handleFile(e, "qris")}
        />
      </div>

      {/* ================= PREVIEW ================= */}
      <InvoicePreview data={data} />
    </div>
  );
}
