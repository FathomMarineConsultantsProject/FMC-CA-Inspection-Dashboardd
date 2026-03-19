import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SurveyorStatusBadge } from '@/components/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SurveyorStatus } from '@/types';
import { toast } from 'sonner';
import { Loader2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 🛠️ API CONFIGURATION
// We use the proxy path to bypass CORS header restrictions on localhost
const SURVEYOR_API_PROXY = "https://surveyor-form-backend.vercel.app/api/shared/forms";
const API_KEY = "FMC_SHARE_9f2b7c1d8e4a6m3q";

const AdminSurveyors = () => {
  const [surveyors, setSurveyors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSurveyors = async () => {
    setLoading(true);
    console.log("🚀 Fetching surveyors via proxy...");
    
    try {
      const res = await axios.get(SURVEYOR_API_PROXY, {
        headers: {
          "x-api-key": API_KEY,
          "Accept": "application/json"
        }
      });
      
      // Based on your Postman screenshot, the array is in res.data.data
      if (res.data && res.data.success) {
        setSurveyors(res.data.data);
        console.log("📦 Data loaded:", res.data.data);
      } else {
        throw new Error("Invalid data structure received");
      }
    } catch (err: any) {
      console.error("Fetch Error:", err);
      
      // Detailed error messaging for the user
      if (err.response?.status === 404) {
        toast.error("Proxy path not found. Ensure Vite config is updated and restarted.");
      } else {
        toast.error("Failed to load external surveyor roster.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveyors();
  }, []);

  const handleStatusUpdate = async (email: string, newStatus: SurveyorStatus) => {
    // Note: Update local state immediately for UI responsiveness
    setSurveyors(prev => prev.map(s => s.email === email ? { ...s, status: newStatus } : s));
    toast.info("Status updated locally.");
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

  return (
    <div className="space-y-4 p-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-primary">Surveyors</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Managing {surveyors.length} external records from roster
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchSurveyors}>
          <RefreshCcw className="h-4 w-4 mr-2" /> Refresh Data
        </Button>
      </div>

      <Card className="border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nationality</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveyors.length > 0 ? (
                surveyors.map((s, idx) => (
                  <TableRow key={s.email || idx}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.email}</TableCell>
                    <TableCell>{s.nationality || "N/A"}</TableCell>
                    <TableCell className="font-mono text-xs">{s.phone_number}</TableCell>
                    <TableCell>
                      <SurveyorStatusBadge status={s.status || 'Active'} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Select 
                        value={s.status || 'Active'} 
                        onValueChange={(v) => handleStatusUpdate(s.email, v as SurveyorStatus)}
                      >
                        <SelectTrigger className="w-[120px] h-8 text-xs ml-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['Active', 'Busy', 'On Leave'].map(st => (
                            <SelectItem key={st} value={st}>{st}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
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

export default AdminSurveyors;