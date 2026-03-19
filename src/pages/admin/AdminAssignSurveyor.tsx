import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// 🌐 URL Configuration
// Updated to your local Node.js server running on port 5000
const BASE_URL = "http://localhost:5000"; 

// External Surveyor API (Using a proxy path to bypass CORS)
const SURVEYOR_API_PROXY = "/api-external/api/shared/forms";
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

  // ✅ Fetch Surveyors via Proxy
  useEffect(() => {
    const fetchSurveyors = async () => {
      setFetchingSurveyors(true);
      try {
        const res = await fetch(SURVEYOR_API_PROXY, {
          method: "GET",
          headers: {
            "x-api-key": API_KEY,
            "Accept": "application/json"
          }
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const responseData = await res.json();

        if (responseData.success && Array.isArray(responseData.data)) {
          setSurveyors(responseData.data);
        }
      } catch (error: any) {
        console.error("🔥 FETCH ERROR:", error.message);
        toast.error("Failed to fetch external surveyor list.");
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
      toast.error("Fill details and select at least one surveyor");
      return;
    }

    setLoading(true);
    const selectedData = surveyors.filter(s => selectedSurveyors.includes(s.email));

    try {
      for (let surveyor of selectedData) {
        // Calling your local Node server at port 5000
        const res = await fetch(`${BASE_URL}/api/enquiries/enquiry`, {
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

      toast.success("Requests broadcasted successfully! ✅");
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
          <p className="text-muted-foreground text-sm">Targeting {surveyors.length} surveyors</p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
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
              {surveyors.map((s, idx) => (
                <label key={s.email || idx} className={`flex items-center gap-3 border p-3 rounded-lg cursor-pointer transition-all ${selectedSurveyors.includes(s.email) ? "bg-blue-50 border-blue-500" : "hover:bg-gray-50"}`}>
                  <input type="checkbox" className="h-4 w-4" checked={selectedSurveyors.includes(s.email)} onChange={() => handleSurveyorSelect(s.email)} />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{s.name}</span>
                    <span className="text-[10px] text-gray-500">{s.nationality} • {s.phone_number}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <Button onClick={handleSendMail} className="w-full mt-4 bg-blue-600 text-white" disabled={loading || fetchingSurveyors}>
            {loading ? "Sending..." : "Broadcast to Selected Surveyors"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAssignSurveyor;