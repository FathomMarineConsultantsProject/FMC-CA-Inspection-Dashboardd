import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InspectionStatusBadge, SurveyorStatusBadge } from '@/components/StatusBadge';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminOverview = () => {
  const [data, setData] = useState({ inspections: [], quotes: [], surveyors: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        // 1. Fetch internal DB data (Inspections & Quotes)
        const internalRes = await axios.get('http://localhost:5000/api/inspections/all');
        
        // 2. Fetch external Surveyor data
        const surveyorRes = await axios.get('https://your-external-api.com/surveyors');

        // Note: adjust internalRes.data based on how your backend sends it (e.g., {inspections, quotes})
        setData({
          inspections: internalRes.data.inspections || [],
          quotes: internalRes.data.quotes || [],
          surveyors: surveyorRes.data || []
        });
      } catch (err) {
        toast.error("Failed to load overview data");
      } finally {
        setLoading(false);
      }
    };
    fetchOverviewData();
  }, []);

  const { inspections, quotes, surveyors } = data;

  const lifecycle = [
    { step: '1. Client Request', count: inspections.length },
    { step: '2. Quote Creation', count: quotes.length },
    { step: '3. Client Approval', count: quotes.filter(q => q.status === 'Approved').length },
    { step: '4. Surveyor Assigned', count: inspections.filter(i => i.status === 'Surveyor Assigned').length },
    { step: '5. Inspection Completed', count: inspections.filter(i => i.status === 'Inspection Completed').length },
  ];

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Inspection lifecycle summary</p>
      </div>

      {/* Lifecycle Progress Bars */}
      <Card>
        <CardHeader><CardTitle className="text-base">Inspection Lifecycle</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {lifecycle.map((l, i) => (
              <div key={l.step} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary rounded-full transition-all duration-500" 
                    style={{ width: `${inspections.length ? (l.count / inspections.length) * 100 : 0}%` }} 
                  />
                </div>
                <div className="w-48 text-sm flex justify-between">
                  <span className="text-muted-foreground">{l.step}</span>
                  <span className="font-bold">{l.count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Inspections */}
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Inspections</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {inspections.slice(0, 5).map(i => (
              <div key={i.requestId} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-transparent hover:border-border transition-colors">
                <div>
                  <p className="text-sm font-medium">{i.requestId} — {i.inspectionType}</p>
                  <p className="text-xs text-muted-foreground">{i.port}, {i.country}</p>
                </div>
                <InspectionStatusBadge status={i.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Surveyor Availability */}
        <Card>
          <CardHeader><CardTitle className="text-base">Surveyor Availability</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {surveyors.slice(0, 5).map(s => (
              <div key={s.email} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-transparent hover:border-border transition-colors">
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.location}</p>
                </div>
                <SurveyorStatusBadge status={s.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;