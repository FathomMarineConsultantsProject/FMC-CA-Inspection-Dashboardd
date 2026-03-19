import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SurveyorStatusBadge } from '@/components/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Clock, Activity, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// 🛠️ CONFIGURATION
const LOCAL_BACKEND = "http://localhost:5000/api/inspections/all";
const SURVEYOR_PROXY_API = "/api-external/api/shared/forms"; // Uses the Vite proxy
const API_KEY = "FMC_SHARE_9f2b7c1d8e4a6m3q";

const AdminDashboard = () => {
  const [inspections, setInspections] = useState([]);
  const [surveyors, setSurveyors] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data on Mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch inspections from your local Node.js backend
        const inspRes = await axios.get(LOCAL_BACKEND);
        
        // Fetch surveyors from the external Vercel backend via proxy
        const surRes = await axios.get(SURVEYOR_PROXY_API, {
          headers: { "x-api-key": API_KEY }
        });
        
        // Update states - note that external API uses .data.data
        setInspections(Array.isArray(inspRes.data) ? inspRes.data : []);
        setSurveyors(surRes.data?.data || []);
        
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        toast.error("Failed to load dashboard data. Check backend connections.");
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
      // Update local state immediately for UI responsiveness
      setSurveyors(prev => prev.map(s => s.email === email ? { ...s, status } : s));
      toast.success('Status updated locally');
      
      // Note: If you want to update the external backend, ensure it supports PATCH
      // await axios.patch(`${SURVEYOR_PROXY_API}/${email}`, { status }, { headers: { "x-api-key": API_KEY } });
    } catch (err) {
      toast.error('Failed to sync status with external server');
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time overview of inspection operations</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  <p className="text-3xl font-bold mt-1">{s.value}</p>
                </div>
                <s.icon className={`h-8 w-8 ${s.color} opacity-20`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Surveyor Management Table */}
      <Card className="border shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-sm font-semibold">Surveyor Availability (External Roster)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Nationality</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead className="text-right">Set Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveyors.length > 0 ? (
                surveyors.map((s, idx) => (
                  <TableRow key={s.email || idx}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.nationality || "N/A"}</TableCell>
                    <TableCell><SurveyorStatusBadge status={s.status || 'Active'} /></TableCell>
                    <TableCell className="text-right">
                      <Select value={s.status || 'Active'} onValueChange={(v) => handleStatusChange(s.email, v)}>
                        <SelectTrigger className="w-[130px] ml-auto h-8 text-xs">
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No surveyors found in the external database.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;