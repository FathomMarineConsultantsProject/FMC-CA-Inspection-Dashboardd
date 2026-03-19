import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InspectionStatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ClientRequests = () => {
  const { user } = useAuth();
  const [inspections, setInspections] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user?.email) return;
    try {
      // We use the 'all' endpoint but filter locally, 
      // or you could create a /api/inspections/my-requests/:email endpoint
      const res = await axios.get(`http://localhost:5000/api/inspections/all`);
      
      const allInspections = res.data.inspections || [];
      const allQuotes = res.data.quotes || [];

      // Filter data only for THIS client
      setInspections(allInspections.filter((i: any) => i.clientEmail === user.email));
      setQuotes(allQuotes.filter((q: any) => q.clientEmail === user.email));
    } catch (err) {
      toast.error("Failed to load your requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleQuote = async (quoteId: string, action: 'Approved' | 'Rejected') => {
    try {
      // Hits your Patch route: router.patch('/update-quote/:id', ...)
      await axios.patch(`http://localhost:5000/api/inspections/update-quote/${quoteId}`, { 
        status: action 
      });
      
      toast.success(`Quote ${action.toLowerCase()} successfully`);
      fetchData(); // Refresh to update statuses
    } catch (err) {
      toast.error("Failed to update quote status");
    }
  };

  const pendingQuotes = quotes.filter(q => q.status === 'Pending');

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display">My Inspection Requests</h1>
        <p className="text-muted-foreground text-sm mt-1">Track and manage your survey requests</p>
      </div>

      {/* Actionable Pending Quotes */}
      {pendingQuotes.length > 0 && (
        <Card className="border-primary/20 bg-primary/5 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quotes Awaiting Your Approval</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {pendingQuotes.map(q => (
              <div key={q.id} className="flex items-center justify-between p-4 rounded-xl bg-card border shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{q.requestId}</span>
                    <p className="text-sm font-bold">{q.inspectionType}</p>
                  </div>
                  <p className="text-2xl font-black mt-1">${q.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{q.port}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleQuote(q.id, 'Rejected')}>Decline</Button>
                  <Button size="sm" onClick={() => handleQuote(q.id, 'Approved')}>Approve & Proceed</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Full Request History */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Ship</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.map(ins => (
                <TableRow key={ins.requestId}>
                  <TableCell className="font-mono text-xs font-bold">{ins.requestId}</TableCell>
                  <TableCell className="text-sm">{ins.inspectionType}</TableCell>
                  <TableCell className="text-sm">{ins.shipType}</TableCell>
                  <TableCell className="text-sm">{ins.port}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{ins.dateFrom} — {ins.dateTo}</TableCell>
                  <TableCell><InspectionStatusBadge status={ins.status} /></TableCell>
                </TableRow>
              ))}
              {inspections.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                    You haven't submitted any requests yet.
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

export default ClientRequests;