import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InspectionStatusBadge } from '@/components/StatusBadge';
import { SurveyorStatusBadge } from '@/components/StatusBadge';

const AdminOverview = () => {
  const { inspections, surveyors, quotes } = useData();

  const lifecycle = [
    { step: '1. Client Request', count: inspections.length },
    { step: '2. Quote Creation', count: quotes.length },
    { step: '3. Client Approval', count: quotes.filter(q => q.status === 'Approved').length },
    { step: '4. Surveyor Assigned', count: inspections.filter(i => i.status === 'Surveyor Assigned').length },
    { step: '5. Inspection Completed', count: inspections.filter(i => i.status === 'Inspection Completed').length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Inspection lifecycle summary</p>
      </div>

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
                  <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${inspections.length ? (l.count / inspections.length) * 100 : 0}%` }} />
                </div>
                <div className="w-48 text-sm">
                  <span className="text-muted-foreground">{l.step}</span>
                  <span className="ml-2 font-bold">{l.count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Inspections</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {inspections.slice(0, 5).map(i => (
              <div key={i.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{i.id} — {i.inspectionType}</p>
                  <p className="text-xs text-muted-foreground">{i.port}, {i.country}</p>
                </div>
                <InspectionStatusBadge status={i.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Surveyor Availability</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {surveyors.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
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
