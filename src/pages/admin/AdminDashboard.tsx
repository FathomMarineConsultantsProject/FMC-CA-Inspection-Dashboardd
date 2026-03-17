import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SurveyorStatusBadge } from '@/components/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Clock, Activity, CheckCircle2 } from 'lucide-react';
import { SurveyorStatus } from '@/types';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { inspections, surveyors, updateSurveyorStatus } = useData();

  const stats = [
    { label: 'Total Requests', value: inspections.length, icon: FileText, color: 'text-primary' },
    { label: 'Pending Requests', value: inspections.filter(i => i.status === 'Pending Review').length, icon: Clock, color: 'text-warning' },
    { label: 'Active Inspections', value: inspections.filter(i => i.status === 'Surveyor Assigned').length, icon: Activity, color: 'text-secondary' },
    { label: 'Completed', value: inspections.filter(i => i.status === 'Inspection Completed').length, icon: CheckCircle2, color: 'text-success' },
  ];

  const handleStatusChange = (id: string, status: SurveyorStatus) => {
    updateSurveyorStatus(id, status);
    toast.success('Surveyor status updated');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of inspection operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="stat-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-3xl font-bold font-display mt-1">{s.value}</p>
                </div>
                <s.icon className={`h-8 w-8 ${s.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Surveyor Status</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Change Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveyors.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.location}</TableCell>
                  <TableCell><SurveyorStatusBadge status={s.status} /></TableCell>
                  <TableCell>
                    <Select value={s.status} onValueChange={(v) => handleStatusChange(s.id, v as SurveyorStatus)}>
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(['Active', 'Busy', 'On Leave', 'Unavailable'] as SurveyorStatus[]).map(st => (
                          <SelectItem key={st} value={st}>{st}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
