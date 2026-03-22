import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InspectionStatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// ✅ Updated Backend URL
const API_BASE_URL = 'https://fmc-client-admin-dashboard-backend.vercel.app/api/inspections';

// ... imports same rahenge ...

const ClientRequests = () => {
  const { user } = useAuth();
  const [inspections, setInspections] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      // ✅ 1. Check kijiye aapka backend /all par kya bhej raha hai.
      // Agar backend sirf array bhej raha hai (res.json(inspections)), toh niche wala code use karein:
      const res = await axios.get(`${API_BASE_URL}/all`);
      
      const allData = Array.isArray(res.data) ? res.data : res.data.inspections || [];

      // ✅ 2. Filter logic (User email ke basis par)
      const userInspections = allData.filter((i: any) => i.clientEmail === user.email);
      
      setInspections(userInspections);

      // ✅ 3. Quotes logic: Agar quotes alag collection mein hain toh alag call lagegi.
      // Agar inspections ke andar hi amount field hai, toh wahi se quotes nikalenge.
      setQuotes(userInspections.filter((i: any) => i.status === 'Quote Sent' || i.status === 'Pending'));
      
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load your requests");
    } finally {
      setLoading(false);
    }
  };

  // Naya submit hone par refresh karne ke liye window focus handle kar sakte hain
  useEffect(() => {
    fetchData();
  }, [user?.email]); // Depend on user email

  const handleQuote = async (quoteId: string, action: 'Approved' | 'Rejected') => {
    try {
      // Backend route check karein: /update-quote ya /update/:id
      await axios.patch(`${API_BASE_URL}/update/${quoteId}`, { 
        status: action === 'Approved' ? 'Quote Approved' : 'Rejected' 
      });
      
      toast.success(`Request ${action.toLowerCase()} successfully`);
      fetchData(); // ✅ Naya data turant fetch karein
    } catch (err) {
      toast.error("Failed to update status");
    }
  };


  // Filter logic fix
const pendingQuotes = quotes.filter(q => 
  q.status === 'Pending' || q.status === 'Pending Review' || q.status === 'Quote Sent'
);

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display">My Inspection Requests</h1>
        <p className="text-muted-foreground text-sm mt-1">Track and manage your survey requests</p>
      </div>

      {pendingQuotes.length > 0 && (
        <Card className="border-primary/20 bg-primary/5 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quotes Awaiting Your Approval</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {pendingQuotes.map(q => (
              <div key={q._id} className="flex items-center justify-between p-4 rounded-xl bg-card border shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{q.requestId}</span>
                    <p className="text-sm font-bold">{q.inspectionType}</p>
                  </div>
                 
        <p className="text-2xl font-black mt-1">
         ${q.fees ? q.fees.toLocaleString() : '0'}
        </p>
                  <p className="text-xs text-muted-foreground">{q.port}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleQuote(q._id, 'Rejected')}>Decline</Button>
                  <Button size="sm" onClick={() => handleQuote(q._id, 'Approved')}>Approve & Proceed</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

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