import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SurveyorStatusBadge } from '@/components/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SurveyorStatus } from '@/types';
import { toast } from 'sonner';

const AdminSurveyors = () => {
  const { surveyors, updateSurveyorStatus } = useData();

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display">Surveyors</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage surveyor roster and availability</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Change Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveyors.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-sm">{s.email}</TableCell>
                  <TableCell>{s.location}</TableCell>
                  <TableCell className="text-sm">{s.phone}</TableCell>
                  <TableCell><SurveyorStatusBadge status={s.status} /></TableCell>
                  <TableCell>
                    <Select value={s.status} onValueChange={(v) => {
                      updateSurveyorStatus(s.id, v as SurveyorStatus);
                      toast.success(`${s.name} status updated to ${v}`);
                    }}>
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(['Active', 'Busy', 'On Leave', 'Unavailable'] as SurveyorStatus[]).map(st => (
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
