import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { SPECIAL_FOCUS_OPTIONS } from '@/data/mockData';
import { toast } from 'sonner';
import { Trash2, Plus } from 'lucide-react';

const AdminPreparation = () => {
  const { inspections, surveyors } = useData();
  const assignedInspections = inspections.filter(i => i.status === 'Surveyor Assigned');

  const [selectedInspection, setSelectedInspection] = useState('');
  const [vesselName, setVesselName] = useState('');
  const [imoNumber, setImoNumber] = useState('');
  const [flag, setFlag] = useState('');
  const [classificationSociety, setClassificationSociety] = useState('');
  const [lastInspectionDate, setLastInspectionDate] = useState('');
  const [certificateValidity, setCertificateValidity] = useState('');
  const [complianceIssues, setComplianceIssues] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [captainPosition, setCaptainPosition] = useState('Captain');
  const [captainNationality, setCaptainNationality] = useState('');
  const [crewMembers, setCrewMembers] = useState<{ name: string; position: string; nationality: string }[]>([]);
  const [newCrew, setNewCrew] = useState({ name: '', position: '', nationality: '' });
  const [specialFocus, setSpecialFocus] = useState<string[]>([]);
  const [captainPhone, setCaptainPhone] = useState('');
  const [captainEmail, setCaptainEmail] = useState('');
  const [shipEmail, setShipEmail] = useState('');
  const [ownerCompany, setOwnerCompany] = useState('');
  const [ownerContact, setOwnerContact] = useState('');
  const [shipManagerContact, setShipManagerContact] = useState('');
  const [chartererContact, setChartererContact] = useState('');

  const addCrew = () => {
    if (!newCrew.name) return;
    setCrewMembers([...crewMembers, newCrew]);
    setNewCrew({ name: '', position: '', nationality: '' });
  };

  const removeCrew = (idx: number) => {
    setCrewMembers(crewMembers.filter((_, i) => i !== idx));
  };

  const handleSend = () => {
    if (!selectedInspection || !vesselName || !imoNumber) {
      toast.error('Please fill in required fields (vessel name, IMO number)');
      return;
    }
    const inspection = inspections.find(i => i.id === selectedInspection);
    const surveyor = surveyors.find(s => s.id === inspection?.surveyorId);
    toast.success(`Preparation information sent to ${surveyor?.name} at ${surveyor?.email}!`);
  };

  const toggleFocus = (area: string) => {
    setSpecialFocus(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-display">Inspection Preparation</h1>
        <p className="text-muted-foreground text-sm mt-1">Prepare and send inspection details to the assigned surveyor</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-2">
          <Label>Select Assigned Inspection</Label>
          <Select value={selectedInspection} onValueChange={setSelectedInspection}>
            <SelectTrigger><SelectValue placeholder="Choose an inspection" /></SelectTrigger>
            <SelectContent>
              {assignedInspections.map(i => {
                const s = surveyors.find(sv => sv.id === i.surveyorId);
                return (
                  <SelectItem key={i.id} value={i.id}>
                    {i.id} — {i.inspectionType} at {i.port} (Surveyor: {s?.name})
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedInspection && (
        <>
          <Card>
            <CardHeader><CardTitle className="text-base">Ship Identification</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Vessel Name *</Label><Input value={vesselName} onChange={e => setVesselName(e.target.value)} placeholder="e.g. MV Atlantic" /></div>
              <div className="space-y-2"><Label>IMO Number *</Label><Input value={imoNumber} onChange={e => setImoNumber(e.target.value)} placeholder="e.g. 1234567" /></div>
              <div className="space-y-2"><Label>Flag</Label><Input value={flag} onChange={e => setFlag(e.target.value)} placeholder="e.g. Panama" /></div>
              <div className="space-y-2"><Label>Classification Society</Label><Input value={classificationSociety} onChange={e => setClassificationSociety(e.target.value)} placeholder="e.g. Lloyd's Register" /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Class Survey Status</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Last Inspection Date</Label><Input type="date" value={lastInspectionDate} onChange={e => setLastInspectionDate(e.target.value)} /></div>
              <div className="space-y-2"><Label>Certificate Validity</Label><Input value={certificateValidity} onChange={e => setCertificateValidity(e.target.value)} placeholder="e.g. Valid until 2027" /></div>
              <div className="space-y-2"><Label>Compliance Issues</Label><Input value={complianceIssues} onChange={e => setComplianceIssues(e.target.value)} placeholder="Any known issues" /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Crew List</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Captain Name</Label><Input value={captainName} onChange={e => setCaptainName(e.target.value)} /></div>
                <div className="space-y-2"><Label>Position</Label><Input value={captainPosition} onChange={e => setCaptainPosition(e.target.value)} /></div>
                <div className="space-y-2"><Label>Nationality</Label><Input value={captainNationality} onChange={e => setCaptainNationality(e.target.value)} /></div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div className="space-y-2"><Label>Crew Name</Label><Input value={newCrew.name} onChange={e => setNewCrew({ ...newCrew, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Position</Label><Input value={newCrew.position} onChange={e => setNewCrew({ ...newCrew, position: e.target.value })} /></div>
                <div className="space-y-2"><Label>Nationality</Label><Input value={newCrew.nationality} onChange={e => setNewCrew({ ...newCrew, nationality: e.target.value })} /></div>
                <Button type="button" size="sm" onClick={addCrew}><Plus className="h-4 w-4 mr-1" /> Add</Button>
              </div>

              {crewMembers.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead><TableHead>Position</TableHead><TableHead>Nationality</TableHead><TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {crewMembers.map((c, i) => (
                      <TableRow key={i}>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>{c.position}</TableCell>
                        <TableCell>{c.nationality}</TableCell>
                        <TableCell><Button variant="ghost" size="sm" onClick={() => removeCrew(i)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Special Focus Areas</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SPECIAL_FOCUS_OPTIONS.map(area => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={specialFocus.includes(area)}
                      onCheckedChange={() => toggleFocus(area)}
                    />
                    <label htmlFor={area} className="text-sm cursor-pointer">{area}</label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Captain Contact</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Captain Phone</Label><Input value={captainPhone} onChange={e => setCaptainPhone(e.target.value)} placeholder="+123456789" /></div>
              <div className="space-y-2"><Label>Captain Email</Label><Input type="email" value={captainEmail} onChange={e => setCaptainEmail(e.target.value)} /></div>
              <div className="space-y-2"><Label>Ship Email</Label><Input type="email" value={shipEmail} onChange={e => setShipEmail(e.target.value)} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Owner Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Owner Company</Label><Input value={ownerCompany} onChange={e => setOwnerCompany(e.target.value)} /></div>
              <div className="space-y-2"><Label>Owner Contact</Label><Input value={ownerContact} onChange={e => setOwnerContact(e.target.value)} /></div>
              <div className="space-y-2"><Label>Ship Manager Contact</Label><Input value={shipManagerContact} onChange={e => setShipManagerContact(e.target.value)} /></div>
              <div className="space-y-2"><Label>Charterer Contact</Label><Input value={chartererContact} onChange={e => setChartererContact(e.target.value)} /></div>
            </CardContent>
          </Card>

          <Button onClick={handleSend} size="lg" className="w-full">
            Send Preparation Information
          </Button>
        </>
      )}
    </div>
  );
};

export default AdminPreparation;
