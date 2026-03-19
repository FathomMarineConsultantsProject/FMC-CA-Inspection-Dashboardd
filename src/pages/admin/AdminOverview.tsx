import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InspectionStatusBadge, SurveyorStatusBadge } from '@/components/StatusBadge';
import { Loader2, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// 🛠️ CONFIGURATION
const LOCAL_API = 'http://localhost:5000/api/inspections/all';
const SURVEYOR_PROXY_API = '/api-external/api/shared/forms'; // Vite Proxy Path
const API_KEY = 'FMC_SHARE_9f2b7c1d8e4a6m3q';

const AdminOverview = () => {
  const [data, setData] = useState({ inspections: [], quotes: [], surveyors: [] });
  const [loading, setLoading] = useState(true);

  const fetchOverviewData = async () => {
    setLoading(true);
    try {
      // 1. Fetch internal DB data (Inspections & Quotes)
      const internalRes = await axios.get(LOCAL_API);
      
      // 2. Fetch external Surveyor data via Proxy
      const surveyorRes = await axios.get(SURVEYOR_PROXY_API, {
        headers: { "x-api-key": API_KEY }
      });

      // Mapping data from both backends
      setData({
        inspections: internalRes.data.inspections || internalRes.data || [],
        quotes: internalRes.data.quotes || [],
        surveyors: surveyorRes.data?.data || [] // Accessing .data.data from external API
      });
    } catch (err) {
      console.error("Overview Fetch Error:", err);
      toast.error("Failed to load overview data from backends");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const { inspections, quotes, surveyors } = data;

  // 📊 Logic for Lifecycle Progress
  const lifecycle = [
    { step: 'Client Requests', count: inspections.length },
    { step: 'Quotes Sent', count: quotes.length },
    { step: 'Quotes Approved', count: quotes.filter(q => q.status === 'Approved').length },
    { step: 'Live Inspections', count: inspections.filter(i => i.status === 'Surveyor Assigned').length },
    { step: 'Completed', count: inspections.filter(i => i.status === 'Inspection Completed').length },
  ];

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold font-display">Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Summary of the global inspection lifecycle</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchOverviewData}>
          <RefreshCcw className="h-4 w-4 mr-2" /> Sync Data
        </Button>
      </div>

      {/* 🚀 Lifecycle Progress Bars */}
      <Card className="border shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-sm font-semibold">Workflow Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-5">
            {lifecycle.map((l, i) => {
              const percentage = inspections.length > 0 ? (l.count / inspections.length) * 100 : 0;
              return (
                <div key={l.step} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 border border-primary/20">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium text-muted-foreground">{l.step}</span>
                      <span className="font-bold">{l.count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-700 ease-in-out" 
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 📋 Recent Inspections (Local DB) */}
        <Card className="border shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-sm font-semibold">Latest Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {inspections.length > 0 ? inspections.slice(0, 5).map((i, idx) => (
              <div key={i._id || idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-transparent hover:border-border transition-colors">
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{i.requestId || 'REQ-88'} — {i.inspectionType}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{i.port}, {i.country}</p>
                </div>
                <InspectionStatusBadge status={i.status} />
              </div>
            )) : (
              <p className="text-center py-4 text-xs text-muted-foreground">No recent inspections.</p>
            )}
          </CardContent>
        </Card>

        {/* 👤 Surveyor Availability (External API) */}
        <Card className="border shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-sm font-semibold">Surveyor Roster</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {surveyors.length > 0 ? surveyors.slice(0, 5).map((s, idx) => (
              <div key={s.email || idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-transparent hover:border-border transition-colors">
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{s.nationality || s.location}</p>
                </div>
                <SurveyorStatusBadge status={s.status || 'Active'} />
              </div>
            )) : (
              <p className="text-center py-4 text-xs text-muted-foreground">No surveyors found in roster.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;