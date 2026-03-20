import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// 🌐 URL Configuration
const BASE_URL = "http://localhost:5000";
// Try calling directly first; if it fails, the code is set up to log why.
const SURVEYOR_API_URL = "https://surveyor-form-backend.vercel.app/api/shared/forms";
const API_KEY = "FMC_SHARE_9f2b7c1d8e4a6m3q"; 

const AdminAssignSurveyor = () => {
  const [surveyors, setSurveyors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSurveyors, setFetchingSurveyors] = useState(true);

  const [inspection, setInspection] = useState({
    inspectionType: "",
    shipType: "",
    location: "",
    dateFrom: "",
    dateTo: "",
    fees: ""
  });

  const [selectedSurveyors, setSelectedSurveyors] = useState<string[]>([]);

  // ✅ Debugging Fetcher
  useEffect(() => {
    const fetchSurveyors = async () => {
      setFetchingSurveyors(true);
      console.log("🚀 Starting Fetch from:", SURVEYOR_API_URL);
      
      try {
        const res = await fetch(SURVEYOR_API_URL, {
          method: "GET",
          headers: {
            "x-api-key": API_KEY,
            "Accept": "application/json"
          }
        });
        
        console.log("📡 Response Status:", res.status);

        if (!res.ok) {
          // 🔴 Capture the actual error message from the server
          const errorText = await res.text();
          console.error("❌ SERVER ERROR BODY:", errorText);
          throw new Error(`HTTP ${res.status}: ${errorText || 'Internal Server Error'}`);
        }
        
        const responseData = await res.json();
        console.log("📦 Received Data:", responseData);

        // Map data based on your Postman screenshot structure
        if (responseData.success && Array.isArray(responseData.data)) {
          setSurveyors(responseData.data);
          toast.success(`Loaded ${responseData.data.length} surveyors`);
        } else {
          console.warn("⚠️ Unexpected JSON structure:", responseData);
          setSurveyors([]);
        }
        
      } catch (error: any) {
        console.error("🔥 FETCH ERROR:", error.message);
        toast.error(`Fetch Failed: ${error.message}`);
      } finally {
        setFetchingSurveyors(false);
      }
    };

    fetchSurveyors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInspection({ ...inspection, [e.target.name]: e.target.value });
  };

  const handleSurveyorSelect = (email: string) => {
    setSelectedSurveyors(prev => 
      prev.includes(email) ? prev.filter(s => s !== email) : [...prev, email]
    );
  };

  const handleSendMail = async () => {
    if (!inspection.inspectionType || selectedSurveyors.length === 0) {
      toast.error("Fill inspection details and select at least one surveyor");
      return;
    }

    setLoading(true);
    const selectedData = surveyors.filter(s => selectedSurveyors.includes(s.email));

    try {
      for (let surveyor of selectedData) {
        console.log(`📤 Sending request to: ${surveyor.email}`);
        const res = await fetch(`${BASE_URL}/api/enquiries/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            surveyorName: surveyor.name,
            surveyorEmail: surveyor.email,
            shipType: inspection.shipType,
            serviceType: inspection.inspectionType,
            portCountry: inspection.location,
            inspectionFrom: inspection.dateFrom,
            inspectionTo: inspection.dateTo,
            recommendedFee: inspection.fees
          }),
        });

        if (!res.ok) throw new Error(`Failed to send to ${surveyor.email}`);
      }

      toast.success("Broadcast successful! ✅");
      setInspection({ inspectionType: "", shipType: "", location: "", dateFrom: "", dateTo: "", fees: "" });
      setSelectedSurveyors([]);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Assign Surveyor</h1>
          <p className="text-muted-foreground text-sm">Targeting {surveyors.length} surveyors in database</p>
        </div>
        {fetchingSurveyors && <span className="text-xs text-blue-500 animate-pulse">Syncing...</span>}
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="inspectionType" placeholder="Inspection Type" className="border p-2 rounded-md w-full text-sm" value={inspection.inspectionType} onChange={handleChange} />
            <input name="shipType" placeholder="Ship Type" className="border p-2 rounded-md w-full text-sm" value={inspection.shipType} onChange={handleChange} />
          </div>

          <input name="location" placeholder="Port / Country" className="border p-2 rounded-md w-full text-sm" value={inspection.location} onChange={handleChange} />

          <div className="grid grid-cols-2 gap-4">
            <input type="date" name="dateFrom" className="border p-2 rounded-md w-full text-sm" value={inspection.dateFrom} onChange={handleChange} />
            <input type="date" name="dateTo" className="border p-2 rounded-md w-full text-sm" value={inspection.dateTo} onChange={handleChange} />
          </div>

          <input name="fees" placeholder="Recommended Fees (USD)" type="number" className="border p-2 rounded-md w-full text-sm" value={inspection.fees} onChange={handleChange} />

          <div className="pt-4 border-t">
            <p className="font-semibold mb-3 text-sm">Select Surveyors</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2">
              {surveyors.length > 0 ? (
                surveyors.map((s, idx) => (
                  <label key={`${s.email}-${idx}`} className={`flex items-center gap-3 border p-3 rounded-lg cursor-pointer transition-all ${selectedSurveyors.includes(s.email) ? "bg-blue-50 border-blue-500" : "hover:bg-gray-50"}`}>
                    <input type="checkbox" className="h-4 w-4" checked={selectedSurveyors.includes(s.email)} onChange={() => handleSurveyorSelect(s.email)} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{s.name}</span>
                      <span className="text-[10px] text-gray-500">{s.nationality} • {s.phone_number}</span>
                    </div>
                  </label>
                ))
              ) : (
                <div className="text-center py-4 border-2 border-dashed rounded-lg">
                  <p className="text-xs text-gray-400">
                    {fetchingSurveyors ? "Fetching..." : "No surveyors found. Check console for 500 error details."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Button onClick={handleSendMail} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white" disabled={loading || fetchingSurveyors}>
            {loading ? "Processing..." : "Send Inspection Requests"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAssignSurveyor;