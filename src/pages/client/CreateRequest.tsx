import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { INSPECTION_TYPES, SHIP_TYPES } from '@/data/mockData';
import { InspectionType, ShipType } from '@/types';
import { toast } from 'sonner';

// ✅ VERCEL BACKEND API
const API_URL = 'https://fmc-client-admin-dashboard-backend.vercel.app/api/requests/add';

// ✅ IMPORTANT FOR CORS
axios.defaults.withCredentials = true;

const CreateRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inspectionType, setInspectionType] = useState<InspectionType | ''>('');
  const [shipType, setShipType] = useState<ShipType | ''>('');
  const [port, setPort] = useState('');
  const [country, setCountry] = useState('');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inspectionType || !shipType || !port || !country || !dateFrom || !dateTo) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        clientId: user?.id || null,
        clientEmail: user?.email || "guest@gmail.com",
        inspectionType,
        shipType,
        port,
        country,
        dateFrom: format(dateFrom, 'yyyy-MM-dd'),
        dateTo: format(dateTo, 'yyyy-MM-dd'),
        status: 'pending review'
      };

      console.log("🚀 PAYLOAD:", payload);

      const res = await axios.post(API_URL, payload);

      console.log("✅ RESPONSE:", res.data);

      toast.success('Inspection request submitted successfully!');
      navigate('/client');

    } catch (error: any) {
      console.error("❌ SUBMIT ERROR:", error?.response?.data || error.message);

      toast.error(
        error?.response?.data?.error ||
        error?.response?.data?.msg ||
        "Failed to submit request"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display">Create Inspection Request</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Submit a new vessel inspection request
        </p>
      </div>

      <Card className="border-none shadow-md">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Inspection + Ship */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Inspection Type</Label>
                <Select value={inspectionType} onValueChange={(v) => setInspectionType(v as InspectionType)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {INSPECTION_TYPES.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ship Type</Label>
                <Select value={shipType} onValueChange={(v) => setShipType(v as ShipType)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select ship type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SHIP_TYPES.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Port + Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Port</Label>
                <Input
                  value={port}
                  onChange={e => setPort(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label>Country</Label>
                <Input
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="e.g. India"
                  className="h-10"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label>Expected Date From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-10",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Expected Date To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-10",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateTo} onSelect={setDateTo} />
                  </PopoverContent>
                </Popover>
              </div>

            </div>

            {/* Submit */}
            <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRequest;