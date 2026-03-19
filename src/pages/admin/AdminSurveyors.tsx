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

const AdminSurveyors = () => {
  const [surveyors, setSurveyors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch from external source
  const fetchSurveyors = async () => {
    setLoading(true);
    try {
      // Replace with your actual external API endpoint
      const res = await axios.get('https://your-external-api.com/api/surveyors');
      setSurveyors(res.data);
    } catch (err) {
      toast.error("Failed to load external surveyor roster");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveyors();
  }, []);

  const handleStatusUpdate = async (email: string, newStatus: SurveyorStatus) => {
    try {
      // Patching to the external server using email as the unique identifier
      await axios.patch(`https://your-external-api.com/api/surveyors/${email}`, { 
        status: newStatus 
      });

      // Update local state immediately for a snappy UI
      setSurveyors(prev => prev.map(s => s.email === email ? { ...s, status: newStatus } : s));
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error("External update failed. Please try again.");
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Surveyors</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage external surveyor roster and real-time availability</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchSurveyors}>
          <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Change Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveyors.map(s => (
                <TableRow key={s.email}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.email}</TableCell>
                  <TableCell>{s.location}</TableCell>
                  <TableCell className="text-sm font-mono">{s.phone}</TableCell>
                  <TableCell><SurveyorStatusBadge status={s.status} /></TableCell>
                  <TableCell className="text-right">
                    <Select 
                      value={s.status} 
                      onValueChange={(v) => handleStatusUpdate(s.email, v as SurveyorStatus)}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs ml-auto">
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

export default AdminSurveyors;