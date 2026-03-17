import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { INSPECTION_TYPES, SHIP_TYPES } from '@/data/mockData';
import { InspectionType, ShipType } from '@/types';
import { toast } from 'sonner';

const CreateRequest = () => {
  const { addInspection } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [inspectionType, setInspectionType] = useState<InspectionType | ''>('');
  const [shipType, setShipType] = useState<ShipType | ''>('');
  const [port, setPort] = useState('');
  const [country, setCountry] = useState('');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectionType || !shipType || !port || !country || !dateFrom || !dateTo) {
      toast.error('Please fill in all fields');
      return;
    }
    addInspection({
      clientId: user!.id,
      clientEmail: user!.email,
      inspectionType: inspectionType as InspectionType,
      shipType: shipType as ShipType,
      port,
      country,
      dateFrom: format(dateFrom, 'yyyy-MM-dd'),
      dateTo: format(dateTo, 'yyyy-MM-dd'),
    });
    toast.success('Inspection request submitted successfully!');
    navigate('/client');
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display">Create Inspection Request</h1>
        <p className="text-muted-foreground text-sm mt-1">Submit a new vessel inspection request</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Inspection Type</Label>
                <Select value={inspectionType} onValueChange={(v) => setInspectionType(v as InspectionType)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {INSPECTION_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ship Type</Label>
                <Select value={shipType} onValueChange={(v) => setShipType(v as ShipType)}>
                  <SelectTrigger><SelectValue placeholder="Select ship type" /></SelectTrigger>
                  <SelectContent>
                    {SHIP_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Port</Label>
                <Input value={port} onChange={e => setPort(e.target.value)} placeholder="e.g. Singapore" />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. Singapore" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expected Date From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Expected Date To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dateTo} onSelect={setDateTo} className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button type="submit" className="w-full">Submit Inspection Request</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRequest;
