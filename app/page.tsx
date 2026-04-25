import InvoiceForm from "./components/InvoiceForm";

export default function Home() {
  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Invoice Generator
      </h1>
      <InvoiceForm />
    </main>
  );
}