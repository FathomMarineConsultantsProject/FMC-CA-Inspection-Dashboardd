import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InspectionStatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// ✅ VERCEL API
const API_BASE_URL = 'https://fmc-client-admin-dashboard-backend.vercel.app/api/requests';

// ✅ IMPORTANT FOR CORS
axios.defaults.withCredentials = true;

const ClientRequests = () => {
  const { user } = useAuth();
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);

      // ✅ BEST: fetch only logged-in user data
      const res = await axios.get(`${API_BASE_URL}/my/${user.email}`);

      setInspections(res.data);

    } catch (err: any) {
      console.error("❌ FETCH ERROR:", err?.response?.data || err.message);
      toast.error("Failed to load your requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.email]);

  const handleQuote = async (id: string, action: 'Approved' | 'Rejected') => {
    try {
      const newStatus = action === 'Approved' ? 'quote approved' : 'rejected';

      await axios.patch(`${API_BASE_URL}/update/${id}`, {
        status: newStatus
      });

      toast.success(`Request ${action.toLowerCase()} successfully`);

      fetchData();

    } catch (err: any) {
      console.error("❌ UPDATE ERROR:", err?.response?.data || err.message);
      toast.error("Failed to update status");
    }
  };

  // ✅ Quotes awaiting approval
  const pendingQuotes = inspections.filter(q => q.status === 'quote sent');

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">

      <div>
        <h1 className="text-2xl font-bold font-display">My Inspection Requests</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track and manage your survey requests
        </p>
      </div>

      {/* ✅ Pending Quotes Section */}
      {pendingQuotes.length > 0 && (
        <Card className="border-primary/20 bg-primary/5 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Quotes Awaiting Your Approval
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-3">
            {pendingQuotes.map(q => (
              <div
                key={q._id}
                className="flex items-center justify-between p-4 rounded-xl bg-card border shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      {q.requestId}
                    </span>
                    <p className="text-sm font-bold">{q.inspectionType}</p>
                  </div>

                  <p className="text-2xl font-black mt-1">
                    ${q.fees?.toLocaleString() || '0'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuote(q._id, 'Rejected')}
                  >
                    Decline
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleQuote(q._id, 'Approved')}
                  >
                    Approve & Proceed
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ✅ Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>

            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Ship</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {inspections.map(ins => (
                <TableRow key={ins._id}>
                  <TableCell className="font-mono text-xs font-bold">
                    {ins.requestId}
                  </TableCell>
                  <TableCell className="text-sm">{ins.inspectionType}</TableCell>
                  <TableCell className="text-sm">{ins.shipType}</TableCell>
                  <TableCell className="text-sm">{ins.port}</TableCell>
                  <TableCell>
                    <InspectionStatusBadge status={ins.status} />
                  </TableCell>
                </TableRow>
              ))}

              {inspections.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                    No requests found.
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