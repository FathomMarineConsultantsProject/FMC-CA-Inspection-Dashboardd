import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Anchor, Ship } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      const user = email.includes('admin') ? 'admin' : 'client';
      navigate(user === 'admin' ? '/admin' : '/client');
      toast.success('Welcome back!');
    } else {
      toast.error('Invalid credentials. Try: client@shipping.com or admin@fathommarine.com');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center p-12">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Anchor className="h-12 w-12 text-secondary" />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-primary-foreground font-display">Fathom Marine</h1>
              <p className="text-sm text-sidebar-foreground">Consultants Pvt Ltd</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground font-display mb-4">
            Marine Inspection Management
          </h2>
          <p className="text-sidebar-foreground text-lg leading-relaxed">
            Streamline your vessel inspections from request to completion. Professional survey management made simple.
          </p>
          <div className="mt-12 flex items-center justify-center gap-6 text-sidebar-foreground/60">
            <Ship className="h-8 w-8" />
            <Ship className="h-6 w-6" />
            <Ship className="h-10 w-10" />
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2 mb-4 lg:hidden">
              <Anchor className="h-8 w-8 text-secondary" />
              <span className="text-xl font-bold text-primary font-display">Fathom Marine</span>
            </div>
            <CardTitle className="text-2xl font-display">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            <div className="mt-6 p-4 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground font-medium mb-2">Demo Accounts:</p>
              <p className="text-xs text-muted-foreground">Client: client@shipping.com</p>
              <p className="text-xs text-muted-foreground">Admin: admin@fathommarine.com</p>
              <p className="text-xs text-muted-foreground mt-1">(any password)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
