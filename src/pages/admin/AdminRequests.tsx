import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InspectionStatusBadge } from '@/components/StatusBadge';
import { Search, Eye, FilePlus, Loader2, Users } from 'lucide-react'; // Users icon add kiya
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const AdminRequests = () => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]); // Surveyors ki availability store karne ke liye
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewItem, setViewItem] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Client Requests
        const resRequests = await axios.get('http://localhost:5000/api/requests/all');
        const reqData = Array.isArray(resRequests.data) ? resRequests.data : resRequests.data.inspections;
        setInspections(reqData || []);

        // 2. Fetch Surveyor Enquiries (Availability tracking)
        const resEnquiries = await axios.get('http://localhost:5000/api/enquiries/all');
        setEnquiries(resEnquiries.data || []);

      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter function for search
  const filtered = inspections.filter(i =>
    i.requestId?.toLowerCase().includes(search.toLowerCase()) ||
    i.port?.toLowerCase().includes(search.toLowerCase())
  );

  // Function to get surveyors for a specific request
  // (Assuming request correlation happens via port/dates or you can add requestId to Enquiry model)
  const getSurveyorsForRequest = (port: string) => {
    return enquiries.filter(e => e.portCountry === port);
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
          <h1 className="text-2xl font-bold font-display tracking-tight">Inspection Requests</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage client requests and track surveyor availability</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Type/Ship</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Surveyor Status</TableHead> {/* New Column */}
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(ins => {
                const relatedSurveyors = getSurveyorsForRequest(ins.port);
                const confirmedCount = relatedSurveyors.filter(s => s.status === 'confirmed').length;

                return (
                  <TableRow key={ins._id}>
                    <TableCell className="font-mono text-xs font-bold">{ins.requestId}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{ins.inspectionType}</div>
                      <div className="text-[10px] text-muted-foreground">{ins.shipType}</div>
                    </TableCell>
                    <TableCell className="text-sm">{ins.port}</TableCell>
                    
                    {/* SURVEYOR AVAILABILITY COLUMN */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <Badge variant={confirmedCount > 0 ? "default" : "outline"} className={confirmedCount > 0 ? "bg-green-500 hover:bg-green-600" : ""}>
                           {confirmedCount} Confirmed
                         </Badge>
                         <span className="text-[10px] text-muted-foreground">out of {relatedSurveyors.length}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <InspectionStatusBadge status={ins.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setViewItem(ins)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* DETAIL DIALOG */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request & Surveyor Availability</DialogTitle>
          </DialogHeader>
          
          {viewItem && (
            <div className="space-y-6 pt-4">
              {/* Request Info */}
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-lg">
                <div><p className="text-xs text-muted-foreground uppercase">Port</p><p className="font-bold">{viewItem.port}</p></div>
                <div><p className="text-xs text-muted-foreground uppercase">Dates</p><p className="font-bold">{viewItem.dateFrom} - {viewItem.dateTo}</p></div>
              </div>

              {/* SURVEYOR RESPONSES SECTION */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Users className="h-4 w-4" /> Surveyor Responses
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="text-xs uppercase">Surveyor Name</TableHead>
                        <TableHead className="text-xs uppercase">Status</TableHead>
                        <TableHead className="text-xs uppercase">Fee Quoted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getSurveyorsForRequest(viewItem.port).length > 0 ? (
                        getSurveyorsForRequest(viewItem.port).map((s: any) => (
                          <TableRow key={s._id}>
                            <TableCell className="text-sm">{s.surveyorName}</TableCell>
                            <TableCell>
                              <Badge variant={s.status === 'confirmed' ? 'default' : s.status === 'declined' ? 'destructive' : 'secondary'} className="text-[10px] uppercase">
                                {s.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm font-mono font-bold">
                              {s.surveyorFee ? `$${s.surveyorFee}` : '--'}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-xs text-muted-foreground py-4">
                            No surveyors assigned to this port yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setViewItem(null)}>Close</Button>
                <Button onClick={() => navigate(`/admin/create?port=${viewItem.port}`)}>Assign More Surveyors</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRequests;