import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const AdminQuotes = () => {
  const { inspections, quotes, addQuote } = useData();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('request');

  const request = requestId ? inspections.find(i => i.id === requestId) : null;
  const [amount, setAmount] = useState('');

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request || !amount) return;
    addQuote({
      requestId: request.id,
      clientEmail: request.clientEmail,
      inspectionType: request.inspectionType,
      port: request.port,
      amount: parseFloat(amount),
    });
    toast.success('Quote sent to client!');
    setAmount('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display">Quotes</h1>
        <p className="text-muted-foreground text-sm mt-1">Create and manage inspection quotations</p>
      </div>

      {request && (
        <Card className="border-secondary/30">
          <CardHeader>
            <CardTitle className="text-base">Create Quote for {request.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendQuote} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><Label className="text-muted-foreground">Client Email</Label><p className="mt-1">{request.clientEmail}</p></div>
                <div><Label className="text-muted-foreground">Inspection Type</Label><p className="mt-1">{request.inspectionType}</p></div>
                <div><Label className="text-muted-foreground">Port</Label><p className="mt-1">{request.port}</p></div>
                <div className="space-y-2">
                  <Label>Quote Amount (USD)</Label>
                  <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 5000" required />
                </div>
              </div>
              <Button type="submit">Send Quote</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">All Quotes</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote ID</TableHead>
                <TableHead>Request ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map(q => (
                <TableRow key={q.id}>
                  <TableCell className="font-mono text-sm">{q.id}</TableCell>
                  <TableCell className="font-mono text-sm">{q.requestId}</TableCell>
                  <TableCell className="text-sm">{q.clientEmail}</TableCell>
                  <TableCell>{q.inspectionType}</TableCell>
                  <TableCell>{q.port}</TableCell>
                  <TableCell className="font-medium">${q.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={q.status === 'Approved' ? 'default' : q.status === 'Rejected' ? 'destructive' : 'secondary'} className="text-[11px]">
                      {q.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{q.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminQuotes;
