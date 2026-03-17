import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InspectionStatusBadge } from '@/components/StatusBadge';
import { Search, Eye, FilePlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InspectionRequest } from '@/types';

const AdminRequests = () => {
  const { inspections } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [viewItem, setViewItem] = useState<InspectionRequest | null>(null);

  const filtered = inspections.filter(i =>
    i.id.toLowerCase().includes(search.toLowerCase()) ||
    i.clientEmail.toLowerCase().includes(search.toLowerCase()) ||
    i.port.toLowerCase().includes(search.toLowerCase()) ||
    i.inspectionType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Inspection Requests</h1>
          <p className="text-muted-foreground text-sm mt-1">All client inspection requests</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Client Email</TableHead>
                <TableHead>Inspection Type</TableHead>
                <TableHead>Ship Type</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(ins => (
                <TableRow key={ins.id}>
                  <TableCell className="font-mono text-sm">{ins.id}</TableCell>
                  <TableCell className="text-sm">{ins.clientEmail}</TableCell>
                  <TableCell>{ins.inspectionType}</TableCell>
                  <TableCell>{ins.shipType}</TableCell>
                  <TableCell>{ins.port}</TableCell>
                  <TableCell>{ins.country}</TableCell>
                  <TableCell className="text-xs">{ins.dateFrom} — {ins.dateTo}</TableCell>
                  <TableCell><InspectionStatusBadge status={ins.status} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setViewItem(ins)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {ins.status === 'Pending Review' && (
                        <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/quotes?request=${ins.id}`)}>
                          <FilePlus className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Request {viewItem?.id}</DialogTitle></DialogHeader>
          {viewItem && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Client:</span> {viewItem.clientEmail}</div>
              <div><span className="text-muted-foreground">Type:</span> {viewItem.inspectionType}</div>
              <div><span className="text-muted-foreground">Ship:</span> {viewItem.shipType}</div>
              <div><span className="text-muted-foreground">Port:</span> {viewItem.port}, {viewItem.country}</div>
              <div><span className="text-muted-foreground">Dates:</span> {viewItem.dateFrom} — {viewItem.dateTo}</div>
              <div><span className="text-muted-foreground">Status:</span> <InspectionStatusBadge status={viewItem.status} /></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRequests;
