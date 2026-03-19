import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SurveyorStatusBadge } from '@/components/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Clock, Activity, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [inspections, setInspections] = useState([]);
  const [surveyors, setSurveyors] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data on Mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch inspections from your primary backend
        const inspRes = await axios.get('http://localhost:5000/api/inspections/all');
        
        // Fetch surveyors from your OTHER specific backend
        const surRes = await axios.get('https://your-external-surveyor-api.com/surveyors');
        
        setInspections(inspRes.data);
        setSurveyors(surRes.data);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { label: 'Total Requests', value: inspections.length, icon: FileText, color: 'text-primary' },
    { label: 'Pending Requests', value: inspections.filter(i => i.status === 'Pending Review').length, icon: Clock, color: 'text-yellow-500' },
    { label: 'Active Inspections', value: inspections.filter(i => i.status === 'Surveyor Assigned').length, icon: Activity, color: 'text-blue-500' },
    { label: 'Completed', value: inspections.filter(i => i.status === 'Inspection Completed').length, icon: CheckCircle2, color: 'text-green-500' },
  ];

  const handleStatusChange = async (email: string, status: string) => {
    try {
      // Update external backend
      await axios.patch(`https://your-external-surveyor-api.com/surveyors/${email}`, { status });
      
      // Update local state so UI reflects change immediately
      setSurveyors(prev => prev.map(s => s.email === email ? { ...s, status } : s));
      toast.success('Surveyor status updated successfully');
    } catch (err) {
      toast.error('Failed to update status on external server');
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of inspection operations</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="border-none shadow-sm bg-card/50 backdrop-blur">
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

      {/* Surveyor Status Table */}
      <Card>
        <CardHeader><CardTitle className="text-base">Surveyor Management</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveyors.map(s => (
                <TableRow key={s.email}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.location}</TableCell>
                  <TableCell><SurveyorStatusBadge status={s.status} /></TableCell>
                  <TableCell className="text-right">
                    <Select value={s.status} onValueChange={(v) => handleStatusChange(s.email, v)}>
                      <SelectTrigger className="w-[140px] ml-auto h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['Active', 'Busy', 'On Leave', 'Unavailable'].map(st => (
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