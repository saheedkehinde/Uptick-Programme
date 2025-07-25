import React, { useEffect } from 'react';
import { useEmployee } from '../contexts/EmployeeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, UserX, Clock, Building, Briefcase } from 'lucide-react';
import { DashboardStats } from '../types';

export function Dashboard() {
  const { state, getFilteredEmployees } = useEmployee();
  const { employees, departments, roles } = state;

  const getDashboardStats = (): DashboardStats => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.status === 'active').length;
    
    const departmentBreakdown = departments.reduce((acc, dept) => {
      acc[dept.name] = employees.filter(emp => emp.departmentId === dept.id).length;
      return acc;
    }, {} as { [key: string]: number });

    const statusBreakdown = employees.reduce((acc, emp) => {
      acc[emp.status] = (acc[emp.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const contractTypeBreakdown = employees.reduce((acc, emp) => {
      acc[emp.contractType] = (acc[emp.contractType] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // New hires (hired in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newHires = employees.filter(emp => emp.hireDate >= thirtyDaysAgo);

    // Employees on probation
    const now = new Date();
    const probationEmployees = employees.filter(emp => 
      emp.probationEndDate && emp.probationEndDate > now
    );

    return {
      totalEmployees,
      activeEmployees,
      departmentBreakdown,
      statusBreakdown,
      contractTypeBreakdown,
      newHires,
      probationEmployees,
    };
  };

  const stats = getDashboardStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'terminated': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'permanent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'contract': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'intern': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className=\"space-y-6\">
      {/* Header */}
      <div>
        <h1 className=\"text-3xl font-bold tracking-tight\">Dashboard</h1>
        <p className=\"text-muted-foreground\">
          Overview of your employee management system
        </p>
      </div>

      {/* Stats Cards */}
      <div className=\"grid gap-4 md:grid-cols-2 lg:grid-cols-4\">
        <Card>
          <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">
            <CardTitle className=\"text-sm font-medium\">Total Employees</CardTitle>
            <Users className=\"h-4 w-4 text-muted-foreground\" />
          </CardHeader>
          <CardContent>
            <div className=\"text-2xl font-bold\">{stats.totalEmployees}</div>
            <p className=\"text-xs text-muted-foreground\">
              {stats.activeEmployees} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">
            <CardTitle className=\"text-sm font-medium\">Active Employees</CardTitle>
            <UserCheck className=\"h-4 w-4 text-muted-foreground\" />
          </CardHeader>
          <CardContent>
            <div className=\"text-2xl font-bold\">{stats.activeEmployees}</div>
            <p className=\"text-xs text-muted-foreground\">
              {((stats.activeEmployees / stats.totalEmployees) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">
            <CardTitle className=\"text-sm font-medium\">New Hires</CardTitle>
            <Clock className=\"h-4 w-4 text-muted-foreground\" />
          </CardHeader>
          <CardContent>
            <div className=\"text-2xl font-bold\">{stats.newHires.length}</div>
            <p className=\"text-xs text-muted-foreground\">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">
            <CardTitle className=\"text-sm font-medium\">On Probation</CardTitle>
            <UserX className=\"h-4 w-4 text-muted-foreground\" />
          </CardHeader>
          <CardContent>
            <div className=\"text-2xl font-bold\">{stats.probationEmployees.length}</div>
            <p className=\"text-xs text-muted-foreground\">
              Currently active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Department and Status Breakdown */}
      <div className=\"grid gap-4 md:grid-cols-2 lg:grid-cols-3\">
        <Card>
          <CardHeader>
            <CardTitle className=\"flex items-center gap-2\">
              <Building className=\"h-5 w-5\" />
              Department Breakdown
            </CardTitle>
            <CardDescription>
              Employee distribution by department
            </CardDescription>
          </CardHeader>
          <CardContent className=\"space-y-3\">
            {Object.entries(stats.departmentBreakdown).map(([dept, count]) => (
              <div key={dept} className=\"flex items-center justify-between\">
                <span className=\"text-sm font-medium\">{dept}</span>
                <Badge variant=\"secondary\">{count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className=\"flex items-center gap-2\">
              <UserCheck className=\"h-5 w-5\" />
              Status Breakdown
            </CardTitle>
            <CardDescription>
              Employee distribution by status
            </CardDescription>
          </CardHeader>
          <CardContent className=\"space-y-3\">
            {Object.entries(stats.statusBreakdown).map(([status, count]) => (
              <div key={status} className=\"flex items-center justify-between\">
                <span className=\"text-sm font-medium capitalize\">{status.replace('-', ' ')}</span>
                <Badge className={getStatusColor(status)}>{count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className=\"flex items-center gap-2\">
              <Briefcase className=\"h-5 w-5\" />
              Contract Types
            </CardTitle>
            <CardDescription>
              Employee distribution by contract type
            </CardDescription>
          </CardHeader>
          <CardContent className=\"space-y-3\">
            {Object.entries(stats.contractTypeBreakdown).map(([type, count]) => (
              <div key={type} className=\"flex items-center justify-between\">
                <span className=\"text-sm font-medium capitalize\">{type}</span>
                <Badge className={getContractTypeColor(type)}>{count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className=\"grid gap-4 md:grid-cols-2\">
        <Card>
          <CardHeader>
            <CardTitle>Recent Hires</CardTitle>
            <CardDescription>
              Employees hired in the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.newHires.length === 0 ? (
              <p className=\"text-sm text-muted-foreground\">No recent hires</p>
            ) : (
              <div className=\"space-y-3\">
                {stats.newHires.slice(0, 5).map((employee) => {
                  const department = departments.find(d => d.id === employee.departmentId);
                  const role = roles.find(r => r.id === employee.roleId);
                  return (
                    <div key={employee.id} className=\"flex items-center justify-between\">
                      <div>
                        <p className=\"text-sm font-medium\">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className=\"text-xs text-muted-foreground\">
                          {role?.title} • {department?.name}
                        </p>
                      </div>
                      <Badge className={getContractTypeColor(employee.contractType)}>
                        {employee.contractType}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Probation Status</CardTitle>
            <CardDescription>
              Employees currently on probation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.probationEmployees.length === 0 ? (
              <p className=\"text-sm text-muted-foreground\">No employees on probation</p>
            ) : (
              <div className=\"space-y-3\">
                {stats.probationEmployees.slice(0, 5).map((employee) => {
                  const department = departments.find(d => d.id === employee.departmentId);
                  const role = roles.find(r => r.id === employee.roleId);
                  const daysLeft = employee.probationEndDate 
                    ? Math.ceil((employee.probationEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    : 0;
                  return (
                    <div key={employee.id} className=\"flex items-center justify-between\">
                      <div>
                        <p className=\"text-sm font-medium\">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className=\"text-xs text-muted-foreground\">
                          {role?.title} • {department?.name}
                        </p>
                      </div>
                      <Badge variant=\"outline\">
                        {daysLeft} days left
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

