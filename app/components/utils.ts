export const formatRupiah = (num: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num || 0);
};

export const formatTanggal = (date: string) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

export const generateInvoiceNumber = () => {
  const now = new Date();
  return `INV-${now.getFullYear()}${(now.getMonth()+1)
    .toString()
    .padStart(2,"0")}-${Math.floor(Math.random()*1000)}`;
};