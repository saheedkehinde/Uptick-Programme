import React from 'react';
import { useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/employees':
        return 'Employee Management';
      case '/employees/new':
        return 'Add New Employee';
      default:
        if (location.pathname.includes('/employees/') && location.pathname.includes('/edit')) {
          return 'Edit Employee';
        }
        return 'Employee Management';
    }
  };

  const getPageDescription = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Overview of your employee management system';
      case '/employees':
        return 'Manage and view all employee records';
      case '/employees/new':
        return 'Add a new employee to the system';
      default:
        if (location.pathname.includes('/employees/') && location.pathname.includes('/edit')) {
          return 'Update employee information';
        }
        return 'Employee management system';
    }
  };

  return (
    <header className=\"h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60\">
      <div className=\"flex h-16 items-center px-6\">
        <div className=\"flex items-center gap-4\">
          <div>
            <h2 className=\"text-lg font-semibold\">{getPageTitle()}</h2>
            <p className=\"text-sm text-muted-foreground\">{getPageDescription()}</p>
          </div>
          <Badge variant=\"outline\" className=\"ml-2\">
            TypeScript
          </Badge>
        </div>
        
        <div className=\"ml-auto flex items-center gap-4\">
          {children}
        </div>
      </div>
      <Separator />
    </header>
  );
}

