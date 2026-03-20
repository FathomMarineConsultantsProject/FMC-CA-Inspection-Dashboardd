import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const BASE_URL = "https://fmc-client-admin-dashboard-backend.vercel.app"; // Apne backend URL se replace karein

const SurveyorResponse = () => {
  const { token } = useParams();
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fee, setFee] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // 1. Fetch Enquiry Details using Token
  useEffect(() => {
    const fetchEnquiry = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/enquiries/token/${token}`);
        if (!res.ok) throw new Error("Link expired or invalid");
        const data = await res.json();
        setEnquiry(data);
        setFee(data.recommendedFee); // Default fee set karein
      } catch (err) {
        toast.error("Error loading inspection details");
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiry();
  }, [token]);

  // 2. Handle Confirm Availability
  const handleConfirm = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/enquiries/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, fee }),
      });

      if (res.ok) {
        toast.success("Availability Confirmed! ✅");
        setSubmitted(true);
      } else {
        toast.error("Failed to confirm");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  // 3. Handle Decline
  const handleDecline = async () => {
    const reason = prompt("Please enter a reason for declining:");
    if (!reason) return;

    try {
      const res = await fetch(`${BASE_URL}/api/enquiries/decline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, reason }),
      });

      if (res.ok) {
        toast.info("Assignment Declined");
        setSubmitted(true);
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#1a1f2b] flex items-center justify-center text-white">Loading...</div>;
  if (submitted) return <div className="min-h-screen bg-[#1a1f2b] flex items-center justify-center text-white">Thank you for your response.</div>;

  return (
    <div className="min-h-screen bg-[#1a1f2b] text-white flex flex-col items-center p-6 font-sans">
      
      {/* Header / Logo Section */}
      <div className="mt-10 mb-16 text-center">
        <div className="bg-white text-[#1a1f2b] px-5 py-2 inline-block font-bold text-xl tracking-tighter">
          FATHOM MARINE
        </div>
        <p className="text-[10px] tracking-[0.3em] mt-1 text-gray-400">CONSULTANTS</p>
      </div>

      {/* Title Section */}
      <div className="w-full max-w-lg border-b border-cyan-500/50 pb-2 mb-10 text-center">
        <h1 className="text-sm tracking-[0.4em] uppercase font-light">Inspection Details</h1>
      </div>

      {/* Info Grid */}
      <div className="w-full max-w-md space-y-5 text-sm">
        <div className="grid grid-cols-2 gap-x-8">
          <span className="text-gray-400 text-right">Inspection Date</span>
          <span className="text-left font-medium">
            {new Date(enquiry.inspectionFrom).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} - {new Date(enquiry.inspectionTo).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-8">
          <span className="text-gray-400 text-right">Location</span>
          <span className="text-left font-medium uppercase">{enquiry.portCountry}</span>
        </div>

        <div className="grid grid-cols-2 gap-x-8">
          <span className="text-gray-400 text-right">Inspection Type</span>
          <span className="text-left font-medium">{enquiry.serviceType}</span>
        </div>

        <div className="grid grid-cols-2 gap-x-8">
          <span className="text-gray-400 text-right">Vessel Type</span>
          <span className="text-left font-medium">{enquiry.shipType}</span>
        </div>

        {/* Fee Input Box */}
        <div className="mt-12 p-6 border border-gray-700 rounded-sm bg-[#222836] text-center">
          <p className="text-xs text-gray-300 mb-6 leading-relaxed">
            The recommended fee for this port is <span className="text-white font-bold">${enquiry.recommendedFee}</span>. 
            Please submit your fee.
          </p>
          
          <div className="flex items-center justify-center gap-3">
            <label className="text-sm">Inspection Fee $</label>
            <input 
              type="number" 
              value={fee} 
              onChange={(e) => setFee(e.target.value)}
              className="bg-white text-black px-3 py-1.5 w-24 rounded-sm focus:outline-none font-bold"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-8 space-y-4">
          <button 
            onClick={handleConfirm}
            className="w-full bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1a1f2b] font-bold py-3 uppercase text-xs tracking-widest transition-all"
          >
            Confirm Availability
          </button>
          
          <div className="text-center text-[10px] text-gray-500 uppercase tracking-widest">Or</div>
          
          <button 
            onClick={handleDecline}
            className="w-full text-gray-400 underline uppercase text-[10px] tracking-[0.3em] hover:text-white transition-all"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyorResponse;