"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const appleProducts = [
  { id: "IPHONE", name: "iPhone" },
  { id: "IPAD", name: "iPad" },
  { id: "MAC", name: "MAC" },
  { id: "WATCH", name: "Watch" },
  { id: "AIRPOD", name: "AirPods" },
];

const insuranceAmounts = {
  IPHONE: [
    { value: "250000", label: "250 000 HUF" },
    { value: "350000", label: "350 000 HUF" },
    { value: "450000", label: "450 000 HUF" },
    { value: "550000", label: "550 000 HUF" },
    { value: "650000", label: "650 000 HUF" },
    { value: "1000000", label: "1 000 000 HUF" },
  ],
  IPAD: [
    { value: "199000", label: "199 000 HUF" },
    { value: "350000", label: "350 000 HUF" },
    { value: "700000", label: "700 000 HUF" },
    { value: "1600000", label: "1 600 000 HUF" },
   
  ],
  MAC: [
    { value: "350000", label: "350 000 HUF" },
    { value: "500000", label: "500 000 HUF" },
    { value: "700000", label: "700 000 HUF" },
    { value: "1000000", label: "1 000 000 HUF" },
    { value: "2000000", label: "1 500 000 HUF" },
    { value: "3000000", label: "2 000 000 HUF" },
  ],
  WATCH: [
    { value: "120000", label: "120 000 HUF" },
    { value: "190000", label: "190 000 HUF" },
    { value: "360000", label: "360 000 HUF" },
    { value: "700000", label: "700 000 HUF" },
   
  ],
  AIRPOD: [
    { value: "85000", label: "85 000 HUF" },
    { value: "120000", label: "120 000 HUF" },
    { value: "300000", label: "300 000 HUF" },
   
  ],
};

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleGetOffers = async () => {
    if (!selectedProduct || !selectedAmount) return;

    setLoading(true);
    try {
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: selectedProduct,
          insuranceAmount: selectedAmount,
        }),
      });

      const data = await response.json();
      setOffers(data.CompositeOfferItems);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(e.target.value);
    setSelectedAmount(""); // Reset insurance amount when product changes
  };

  const handleGetContract = (offer: any) => {
    router.push(`/create?offer=${encodeURIComponent(JSON.stringify(offer))}`);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Apple Products Insurance</h1>

        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Product
            </label>
            <select
              value={selectedProduct}
              onChange={handleProductChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select a product</option>
              {appleProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Amount
              </label>
              <select
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select insurance amount</option>
                {insuranceAmounts[
                  selectedProduct as keyof typeof insuranceAmounts
                ]?.map((amount) => (
                  <option key={amount.value} value={amount.value}>
                    {amount.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleGetOffers}
            disabled={!selectedProduct || !selectedAmount || loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Loading..." : "Get Insurance Offers"}
          </button>
        </div>

        {offers.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">
              Available Insurance Offers
            </h2>
            <div className="space-y-4">
              {offers.map(
                (offer, index) => (
                  // console.log(offer),
                  (
                    <div key={index} className="border p-4 rounded-md">
                      {offer.OfferItems.map((item: any) => (
                        <div key={item.Pcode}>
                          {" "}
                          <h3 className="font-semibold">{item.Pcode}</h3>
                          <p className="text-gray-600">{item.Value}</p>
                        </div>
                      ))}
                      <p className="text-green-600 font-bold mt-2">
                        {" "}
                        price:{" "}
                        {
                          Number(offer.CalcItems.find(
                            (item: any) => item.Code === "2"
                          )?.Value).toLocaleString()
                        }{" "}
                        HUF
                      </p>
                      <button
                        onClick={() => handleGetContract(offer)}
                        disabled={
                          !selectedProduct || !selectedAmount || loading
                        }
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 mt-2"
                      >
                        {loading ? "Loading..." : "Get an insurance contract"}
                      </button>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
