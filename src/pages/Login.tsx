import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // ✅ IMPORTANT
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Anchor } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ IMPORTANT

  const API = "https://fmc-client-admin-dashboard-backend.vercel.app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      console.log("LOGIN DATA:", data); // 🔍 Debug

      if (res.ok && data?.user) {
        // ✅ USE AUTH CONTEXT (FIX)
        login(data.user, data.token);

        // ✅ NAVIGATION
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/client");
        }

        toast.success("Login successful 🚀");
      } else {
        toast.error(data.msg || "Invalid credentials");
      }

    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center p-12">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Anchor className="h-12 w-12 text-secondary" />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-primary-foreground">
                Fathom Marine
              </h1>
              <p className="text-sm text-primary-foreground/70">
                Consultants Pvt Ltd
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Marine Inspection Management
          </h2>

          <p className="text-primary-foreground/80 text-lg">
            Manage vessel inspections, clients, and reports in one powerful dashboard.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4 lg:hidden">
              <Anchor className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Fathom Marine</span>
            </div>

            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your email and password to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* EMAIL */}
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* BUTTON */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>

            </form>

            {/* REGISTER BUTTON */}
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate("/register")}
            >
              New Client? Register Here
            </Button>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;