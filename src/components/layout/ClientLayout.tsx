import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Anchor, FileText, FilePlus, LogOut } from 'lucide-react';
import { NavLink } from '@/components/NavLink';

const ClientLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b bg-card px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Anchor className="h-5 w-5 text-secondary" />
            <span className="font-bold text-primary font-display text-sm">Fathom Marine</span>
          </div>
          <nav className="flex items-center gap-1">
            <NavLink
              to="/client"
              end
              className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted"
              activeClassName="bg-muted text-foreground font-medium"
            >
              <FileText className="h-4 w-4 mr-1.5 inline" />
              My Requests
            </NavLink>
            <NavLink
              to="/client/new"
              className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted"
              activeClassName="bg-muted text-foreground font-medium"
            >
              <FilePlus className="h-4 w-4 mr-1.5 inline" />
              New Request
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{user?.company}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;
