import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';
import {
  LayoutDashboard, FileText, Users, FilePlus, Receipt, ClipboardList, BarChart3,
  Anchor, LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Inspection Requests', url: '/admin/requests', icon: FileText },
  { title: 'Surveyors', url: '/admin/surveyors', icon: Users },
  { title: 'Create Inspection', url: '/admin/create', icon: FilePlus },
  { title: 'Quotes', url: '/admin/quotes', icon: Receipt },
  { title: 'Preparation', url: '/admin/preparation', icon: ClipboardList },
  { title: 'Overview', url: '/admin/overview', icon: BarChart3 },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon" className="border-r-0">
          <SidebarContent className="bg-sidebar">
            <div className="p-4 flex items-center gap-2">
              <Anchor className="h-6 w-6 text-sidebar-primary shrink-0" />
              <div className="overflow-hidden">
                <h2 className="text-sm font-bold text-sidebar-foreground font-display truncate">Fathom Marine Consultants PVT LTD</h2>
                <p className="text-[10px] text-sidebar-muted truncate">Admin Panel</p>
              </div>
            </div>

            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-muted text-[10px] uppercase tracking-wider">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end={item.url === '/admin'}
                          className="text-sidebar-foreground hover:bg-sidebar-accent"
                          activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                        >
                          <item.icon className="h-4 w-4 mr-2 shrink-0" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b px-4 bg-card">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-sm font-semibold text-foreground">
                {navItems.find(n => location.pathname === n.url || (n.url !== '/admin' && location.pathname.startsWith(n.url)))?.title || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{user?.name}</span>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-medium">
                  {user?.name?.charAt(0)}
                </span>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
