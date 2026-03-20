import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Clock, Activity, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

// ✅ CONFIG (NO PROXY)
const BACKEND_URL = "https://fmc-client-admin-dashboard-backend.vercel.app"; 
const SURVEYOR_API = "https://surveyor-form-backend.vercel.app/api/shared/forms";
const API_KEY = "FMC_SHARE_9f2b7c1d8e4a6m3q";

const AdminDashboard = () => {
  const [inspections, setInspections] = useState([]);
  const [surveyors, setSurveyors] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inspRes, surRes] = await Promise.all([
          axios.get(BACKEND_URL),
          axios.get(SURVEYOR_API, {
            headers: { "x-api-key": API_KEY }
          })
        ]);

        setInspections(Array.isArray(inspRes.data) ? inspRes.data : []);
        setSurveyors(surRes.data?.data || []);

      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ STATS
  const stats = [
    {
      label: "Total Requests",
      value: inspections.length,
      icon: FileText,
      color: "text-blue-600"
    },
    {
      label: "Pending",
      value: inspections.filter(i => i.status === "Pending Review").length,
      icon: Clock,
      color: "text-yellow-500"
    },
    {
      label: "Active",
      value: inspections.filter(i => i.status === "Surveyor Assigned").length,
      icon: Activity,
      color: "text-purple-500"
    },
    {
      label: "Completed",
      value: inspections.filter(i => i.status === "Inspection Completed").length,
      icon: CheckCircle2,
      color: "text-green-600"
    }
  ];

  // ✅ STATUS UPDATE (LOCAL ONLY)
  const handleStatusChange = (email, status) => {
    setSurveyors(prev =>
      prev.map(s => (s.email === email ? { ...s, status } : s))
    );
    toast.success("Status updated");
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Inspection Overview</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <Card key={idx}>
            <CardContent className="p-5 flex justify-between">
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <h2 className="text-2xl font-bold">{s.value}</h2>
              </div>
              <s.icon className={`h-8 w-8 ${s.color}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SURVEYOR TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Surveyors</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {surveyors.map((s, idx) => (
                <TableRow key={`${s.email}-${idx}`}> {/* ✅ FIXED */}
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.email}</TableCell>

                  <TableCell>{s.status || "Active"}</TableCell>

                  <TableCell className="text-right">
                    <Select
                      value={s.status || "Active"}
                      onValueChange={(v) => handleStatusChange(s.email, v)}
                    >
                      <SelectTrigger className="w-[120px] ml-auto">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Busy">Busy</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
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

export default AdminDashboard;