import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InspectionStatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ClientRequests = () => {
  const { inspections, quotes, updateQuoteStatus } = useData();
  const { user } = useAuth();
  const myInspections = inspections.filter(i => i.clientId === user?.id);
  const myQuotes = quotes.filter(q => q.clientEmail === user?.email);
  const pendingQuotes = myQuotes.filter(q => q.status === 'Pending');

  const handleQuote = (quoteId: string, action: 'Approved' | 'Rejected') => {
    updateQuoteStatus(quoteId, action);
    toast.success(`Quote ${action.toLowerCase()}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display">My Inspection Requests</h1>
        <p className="text-muted-foreground text-sm mt-1">Track all your submitted inspection requests</p>
      </div>

      {pendingQuotes.length > 0 && (
        <Card className="border-secondary/30 bg-secondary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-secondary">Pending Quotes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingQuotes.map(q => (
              <div key={q.id} className="flex items-center justify-between p-3 rounded-lg bg-card border">
                <div>
                  <p className="text-sm font-medium">{q.inspectionType} — {q.port}</p>
                  <p className="text-lg font-bold text-foreground">${q.amount.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleQuote(q.id, 'Approved')}>Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => handleQuote(q.id, 'Rejected')}>Reject</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Inspection Type</TableHead>
                <TableHead>Ship Type</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myInspections.map(ins => (
                <TableRow key={ins.id}>
                  <TableCell className="font-mono text-sm">{ins.id}</TableCell>
                  <TableCell>{ins.inspectionType}</TableCell>
                  <TableCell>{ins.shipType}</TableCell>
                  <TableCell>{ins.port}</TableCell>
                  <TableCell className="text-sm">{ins.dateFrom} — {ins.dateTo}</TableCell>
                  <TableCell><InspectionStatusBadge status={ins.status} /></TableCell>
                </TableRow>
              ))}
              {myInspections.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No inspection requests yet. Create your first one!
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
