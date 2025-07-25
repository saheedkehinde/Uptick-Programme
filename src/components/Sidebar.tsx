import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Building, 
  Settings,
  ChevronRight
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Employees',
    href: '/employees',
    icon: Users,
  },
  {
    name: 'Add Employee',
    href: '/employees/new',
    icon: UserPlus,
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className=\"flex h-full w-64 flex-col bg-card border-r\">
      {/* Logo */}
      <div className=\"flex h-16 items-center px-6 border-b\">
        <div className=\"flex items-center gap-2\">
          <Building className=\"h-8 w-8 text-primary\" />
          <div>
            <h1 className=\"text-lg font-semibold\">HR Dashboard</h1>
            <p className=\"text-xs text-muted-foreground\">Employee Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className=\"flex-1 space-y-1 p-4\">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.name} to={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 h-11',
                  isActive && 'bg-secondary text-secondary-foreground'
                )}
              >
                <item.icon className=\"h-5 w-5\" />
                {item.name}
                {isActive && <ChevronRight className=\"ml-auto h-4 w-4\" />}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className=\"p-4 border-t\">
        <div className=\"text-xs text-muted-foreground text-center\">
          <p>Employee Management System</p>
          <p className=\"mt-1\">v1.0.0</p>
        </div>
      </div>
    </div>
  );
}

