import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminQuotes = () => {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('request');

  const [inspections, setInspections] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/inspections/all');
      // Assuming backend returns { inspections, quotes }
      setInspections(res.data.inspections || []);
      setQuotes(res.data.quotes || []);
    } catch (err) {
      toast.error("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const request = requestId ? inspections.find(i => i.requestId === requestId) : null;

  const handleSendQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request || !amount) return;

    try {
      await axios.post('http://localhost:5000/api/quotes/send', {
        requestId: request.requestId,
        clientEmail: request.clientEmail,
        inspectionType: request.inspectionType,
        port: request.port,
        amount: parseFloat(amount),
      });

      toast.success('Quote sent to client!');
      setAmount('');
      fetchData(); // Refresh the table
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to send quote");
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display">Quotes</h1>
        <p className="text-muted-foreground text-sm mt-1">Create and manage inspection quotations</p>
      </div>

      {request && (
        <Card className="border-secondary/30 bg-secondary/5">
          <CardHeader>
            <CardTitle className="text-base">Create Quote for {request.requestId}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendQuote} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div><Label className="text-muted-foreground">Client Email</Label><p className="mt-1 font-medium">{request.clientEmail}</p></div>
                <div><Label className="text-muted-foreground">Type</Label><p className="mt-1 font-medium">{request.inspectionType}</p></div>
                <div><Label className="text-muted-foreground">Port</Label><p className="mt-1 font-medium">{request.port}</p></div>
                <div className="space-y-2">
                  <Label>Amount (USD)</Label>
                  <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 5000" required className="h-9" />
                </div>
              </div>
              <Button type="submit">Send Quote to Client</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">All Quotations</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote ID</TableHead>
                <TableHead>Request ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No quotes found.</TableCell></TableRow>
              ) : (
                quotes.map(q => (
                  <TableRow key={q.id}>
                    <TableCell className="font-mono text-xs">{q.id}</TableCell>
                    <TableCell className="font-mono text-xs">{q.requestId}</TableCell>
                    <TableCell className="text-sm">{q.clientEmail}</TableCell>
                    <TableCell className="font-medium">${q.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={q.status === 'Approved' ? 'default' : q.status === 'Rejected' ? 'destructive' : 'secondary'} className="text-[10px] px-2 py-0">
                        {q.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{q.createdAt}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminQuotes;