"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CreateContractPage = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [offer, setOffer] = useState<any>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const [device, setDevice] = useState<any>(null);
  const [premium, setPremium] = useState<any>(null);
  const [premiumSum, setPremiumSum] = useState<any>(null);

  const [period, setPeriod] = useState<any>(null);
  const [packege, setPackege] = useState<any>(null);

  const router = useRouter();

  const [formData, setFormData] = useState({
    ID_Of_Certificate_Policy: "",
    ID_Of_Product: "",
    ID_of_Package: "",
    Birth_Date_Personal: "",
    Name_Personal: "",
    Surname_Personal: "",
    Post_Code: "",
    Town: "",
    Adress_Personal: "",
    Device_Group: "",
    Device_Name: "",
    Device_SerialNo: "",
    Value_of_the_device: "",
    Gross_Premium_in_HUF: "",
    Commission: "",
    Commission_TPA: "",
    Date_of_Certificate: "",
    Date_of_Start_a_Cover: "",
    Date_of_End_a_Cover: "",
    Sum_Insured: "",
    Deductible: "",
    ID_of_Shop: "",
    ID_of_Seller: "",
  });

  const [fetchData, setFetchData] = useState({
    ibt_id: "ANNA",
    icd_dbeg: "2025-05-25",
    icd_vplcode: "YEAR_1",
    idp: [
      {
        code: "PACKAGE",
        value: "PREMIUM",
      },
      {
        code: "INSURED_DEVICES",
        value: "IPHONE",
      },
      {
        code: "SUM_INSURED_MAX",
        value: "250000",
      },
    ],
    objs: {
      mpd: [
        {
          "@id": "soc_72819660",
          ctg: "2",
          isnotres: "0",
          code: "2733912859",
          namelat: "Zaporozhan",
          namelatshort: "Roman",
          bdate: "1974-11-07",
          advp: [
            {
              code: "TOWN",
              value: "Kyiv",
            },
            {
              code: "ADRESS_PERSONAL",
              value: "Garden 1B",
            },
          ],
        },
      ],
    },
  });

  useEffect(() => {
    const offerData = searchParams.get("offer");

    if (offerData) {
      try {
        const parsedOffer = JSON.parse(decodeURIComponent(offerData));
        setOffer(parsedOffer);
        setDevice(
          parsedOffer.InputParameters.find(
            (item: any) => item.Code == "INSURED_DEVICES"
          )?.Value
        );
        setPremium(
          parsedOffer.CalcItems.find((item: any) => item.Code == "2")?.Value
        );
        setPeriod(
          parsedOffer.OfferItems.find((item: any) => item.Pcode == "PERIOD_DOG")
            ?.Code
        );
        setPackege(
          parsedOffer.OfferItems.find((item: any) => item.Pcode == "PACKAGE")
            ?.Code
        );
        setPremiumSum(
          parsedOffer.InputParameters.find(
            (item: any) => item.Code == "SUM_INSURED_MAX"
          )?.Value
        );
        // console.log(premium);
        setFormData({
          ...formData,
          Sum_Insured: Number(parsedOffer.CalcItems.find(
            (item: any) => item.Code == "2"
          )?.Value).toLocaleString(),
          Gross_Premium_in_HUF: Number(parsedOffer.InputParameters.find(
            (item: any) => item.Code == "SUM_INSURED_MAX"
          )?.Value).toLocaleString(),
          Device_Group: parsedOffer.InputParameters.find(
            (item: any) => item.Code == "INSURED_DEVICES"
          )?.Value,
          ID_of_Package: parsedOffer.OfferItems.find(
            (item: any) => item.Pcode == "PACKAGE"
          )?.Code,
          Deductible:Number(parsedOffer.CalcItems.find(
            (item: any) => item.Code == "K5"
          )?.Value).toLocaleString(),
          Commission:Number(parsedOffer.CalcItems.find(
            (item: any) => item.Code == "K7"
          )?.Value).toLocaleString(),
        });
        // console.log(parsedOffer);
        // Optionally pre-fill some fields from the offer data
        // For example, if offer contains device info:
        // setFormData(prev => ({ ...prev, Device_Name: parsedOffer.Device_Name, Value_of_the_device: parsedOffer.Value_of_the_device }));
      } catch (error) {
        console.error("Failed to parse offer data:", error);
      }
    }
  }, [searchParams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "Date_of_Start_a_Cover") {
      const startDate = new Date(value);
      let endDate = null;

      if (period === "YEAR_1") {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() - 1);
        endDate.setFullYear(startDate.getFullYear() + 1);
      }
      if (period === "YEAR_2") {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() - 1);
        endDate.setFullYear(startDate.getFullYear() + 2);
      }

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        Date_of_End_a_Cover: endDate ? endDate.toISOString().split("T")[0] : "", // Format as YYYY-MM-DD
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
// console.log(formData);
  const handleSubmit = async (e: React.FormEvent) => {
      setLoading(true)
    e.preventDefault();
    // You would typically combine offer data and form data here
    const submissionData = {
      ibt_id: "ANNA",
      icd_dbeg: formData.Date_of_Start_a_Cover,
      icd_vplcode: period,
      icd_externalid: Date.now(),
      idp: [
        {
          code: "PACKAGE",
          value: packege,
        },
        {
          code: "INSURED_DEVICES",
          value: device,
        },
        {
          code: "SUM_INSURED_MAX",
          value: premiumSum,
        },
      ],
      objs: {
        mpd: [
          {
            code: "2733912859",
            namelat: formData.Name_Personal,
            namelatshort: formData.Surname_Personal,
            bdate: formData.Birth_Date_Personal,
            advp: [
              {
                code: "TOWN",
                value: formData.Town,
              },
              {
                code: "ADRESS_PERSONAL",
                value: formData.Adress_Personal,
              },
            ],
          },
        ],
      },
    }; // Simple merge, adjust as needed
    // console.log(submissionData);
    try {
      const response = await fetch("/api/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Contract imported successfully:", result);
        setImportResult(result);
        // Handle successful import (e.g., show success message, navigate to a confirmation page)
      } else {
        const errorData = await response.json();
        console.error("Failed to import contract:", errorData);
        setImportResult(errorData);
        // Handle error (e.g., show error message)
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setImportResult({ error: error instanceof Error ? error.message : "Unknown error occurred" });
      // Handle network errors
    } finally {
      setLoading(false);
    }
  };

  if (!offer) {
    return <div>Loading offer details...</div>; // Or handle error if offer is missing
  }
// console.log(loading);
  // Basic rendering - you'll likely want to style this better
  return (
    <div className="container mx-auto p-4 max-w-2xl">
        <button onClick={() => router.push("/")} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 mt-2  mb-4">back to offer</button>
      <h1 className="text-2xl font-bold mb-4">Create Insurance Contract</h1>

      {/* <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Offer Details:</h2> */}
      {/* Display key offer details here */}
      {/* Example: */}
      {/* {offer.OfferItems && offer.OfferItems.map((item: any, index: number) => (
          <p key={index}><strong>{item.PcodeName}:</strong> {item.Value}</p>
        ))}
        {offer.CalcItems && offer.CalcItems.map((item: any, index: number) => (
          <p key={index}><strong>{item.Name}:</strong> {item.Value}</p>
        ))} */}

      {/* </div> */}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input fields based on the provided list */}
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label
              htmlFor={key}
              className="block text-sm font-medium text-gray-700"
            >
              {key.replace(/_/g, " ")}: {/* Basic label formatting */}
            </label>
            <input
              type={
                key == "Date_of_Certificate"
                  ? "date"
                  : key == "Date_of_Start_a_Cover"
                  ? "date"
                  : key == "Date_of_End_a_Cover"
                  ? "date"
                  : key == "Birth_Date_Personal"
                  ? "date"
                  : "text"
              } // Use appropriate input types (date, number, etc.)
              name={key}
              id={key}
              value={(formData as any)[key]}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        ))}

        <button
          type="submit"disabled={loading}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400 mt-2"
        >
         {loading ? "Loading..." : "Submit Contract"}
        </button>
      </form>

      {/* Display Import Result */}
      {importResult && (
        <div className="mt-8 p-4 border rounded-md bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">Import Result:</h2>
          <pre className="whitespace-pre-wrap break-words">{JSON.stringify(importResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CreateContractPage;
