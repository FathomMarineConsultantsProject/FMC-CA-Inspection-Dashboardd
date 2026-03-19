import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InspectionStatusBadge } from '@/components/StatusBadge';
import { Search, Eye, FilePlus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const AdminRequests = () => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewItem, setViewItem] = useState<any | null>(null);

  // Fetch all requests from backend
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/requests/all');
        // If your backend returns an object { inspections, quotes }, handle accordingly:
        const data = Array.isArray(res.data) ? res.data : res.data.inspections;
        setInspections(data || []);
      } catch (err) {
        toast.error("Failed to load inspection requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filtered = inspections.filter(i =>
    i.requestId?.toLowerCase().includes(search.toLowerCase()) ||
    i.clientEmail?.toLowerCase().includes(search.toLowerCase()) ||
    i.port?.toLowerCase().includes(search.toLowerCase()) ||
    i.inspectionType?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Inspection Requests</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage incoming client survey requests</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-9" 
            placeholder="Search ID, Email or Port..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Client Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Ship</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                    No requests found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(ins => (
                  <TableRow key={ins._id}>
                    <TableCell className="font-mono text-xs font-bold">{ins.requestId}</TableCell>
                    <TableCell className="text-sm">{ins.clientEmail}</TableCell>
                    <TableCell className="text-sm">{ins.inspectionType}</TableCell>
                    <TableCell className="text-sm">{ins.shipType}</TableCell>
                    <TableCell className="text-sm">{ins.port}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {ins.dateFrom} — {ins.dateTo}
                    </TableCell>
                    <TableCell>
                      <InspectionStatusBadge status={ins.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setViewItem(ins)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {ins.status === 'Pending Review' && (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => navigate(`/admin/quotes?request=${ins.requestId}`)}
                          >
                            <FilePlus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Details: {viewItem?.requestId}</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs uppercase font-semibold">Client</p>
                  <p>{viewItem.clientEmail}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs uppercase font-semibold">Inspection Type</p>
                  <p>{viewItem.inspectionType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs uppercase font-semibold">Ship Type</p>
                  <p>{viewItem.shipType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs uppercase font-semibold">Location</p>
                  <p>{viewItem.port}, {viewItem.country}</p>
                </div>
              </div>
              <div className="bg-muted/30 p-3 rounded-md flex justify-between items-center">
                <span className="text-sm font-medium">Current Status:</span>
                <InspectionStatusBadge status={viewItem.status} />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                 <Button variant="outline" onClick={() => setViewItem(null)}>Close</Button>
                 {viewItem.status === 'Pending Review' && (
                   <Button onClick={() => navigate(`/admin/quotes?request=${viewItem.requestId}`)}>
                     Create Quote
                   </Button>
                 )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRequests;