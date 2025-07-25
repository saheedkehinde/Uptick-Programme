import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Clock, 
  Building2, 
  TrendingUp,
  Activity,
  Award,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';

// Mock data for demonstration
const mockEmployees = [
  {
    id: 'emp_1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1-555-0101',
    department: 'Engineering',
    role: 'Senior Software Engineer',
    status: 'active',
    contractType: 'permanent',
    hireDate: '2023-03-15',
    probation: false,
  },
  {
    id: 'emp_2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1-555-0201',
    department: 'Human Resources',
    role: 'HR Manager',
    status: 'active',
    contractType: 'permanent',
    hireDate: '2023-06-01',
    probation: false,
  },
  {
    id: 'emp_3',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@company.com',
    phone: '+1-555-0301',
    department: 'Engineering',
    role: 'Software Engineer',
    status: 'active',
    contractType: 'permanent',
    hireDate: '2024-01-15',
    probation: true,
    probationEndDate: '2024-07-15',
  },
  {
    id: 'emp_4',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@company.com',
    phone: '+1-555-0401',
    department: 'Marketing',
    role: 'Marketing Specialist',
    status: 'active',
    contractType: 'contract',
    hireDate: '2023-09-20',
    probation: false,
  },
  {
    id: 'emp_5',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@company.com',
    phone: '+1-555-0501',
    department: 'Sales',
    role: 'Sales Representative',
    status: 'active',
    contractType: 'intern',
    hireDate: '2024-11-01',
    probation: true,
    probationEndDate: '2025-05-01',
  },
  {
    id: 'emp_6',
    firstName: 'Jessica',
    lastName: 'Brown',
    email: 'jessica.brown@company.com',
    phone: '+1-555-0601',
    department: 'Finance',
    role: 'Financial Analyst',
    status: 'on-leave',
    contractType: 'permanent',
    hireDate: '2022-08-10',
    probation: false,
  },
];

export function SimpleDashboard() {
  // Calculate statistics
  const totalEmployees = mockEmployees.length;
  const activeEmployees = mockEmployees.filter(emp => emp.status === 'active').length;
  const onProbation = mockEmployees.filter(emp => emp.probation).length;
  
  // New hires in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newHires = mockEmployees.filter(emp => 
    new Date(emp.hireDate) >= thirtyDaysAgo
  ).length;

  // Department breakdown
  const departmentBreakdown = mockEmployees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Status breakdown
  const statusBreakdown = mockEmployees.reduce((acc, emp) => {
    acc[emp.status] = (acc[emp.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Contract type breakdown
  const contractTypeBreakdown = mockEmployees.reduce((acc, emp) => {
    acc[emp.contractType] = (acc[emp.contractType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'on-leave': return 'status-on-leave';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getContractBadgeClass = (contractType: string) => {
    switch (contractType) {
      case 'permanent': return 'contract-permanent';
      case 'contract': return 'contract-contract';
      case 'intern': return 'contract-intern';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Statistics Cards */}
      <div className="mobile-grid gap-6">
        <Card className="card-navy card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-soft-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-light-navy-900 dark:text-white">{totalEmployees}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {activeEmployees} active
            </p>
          </CardContent>
        </Card>

        <Card className="card-navy card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-light-navy-900 dark:text-white">{activeEmployees}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {((activeEmployees / totalEmployees) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="card-navy card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Hires</CardTitle>
            <UserPlus className="h-4 w-4 text-soft-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-light-navy-900 dark:text-white">{newHires}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="card-navy card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Probation</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-light-navy-900 dark:text-white">{onProbation}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Currently active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Breakdown */}
        <Card className="card-navy">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-soft-blue-600" />
              <span>Department Breakdown</span>
            </CardTitle>
            <CardDescription>Employee distribution by department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(departmentBreakdown).map(([department, count]) => (
              <div key={department} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{department}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-slate-200 dark:bg-light-navy-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-soft-blue-500 rounded-full transition-smooth"
                      style={{ width: `${(count / totalEmployees) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-soft-blue-600 min-w-[20px]">{count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card className="card-navy">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span>Status Breakdown</span>
            </CardTitle>
            <CardDescription>Employee distribution by status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(statusBreakdown).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${getStatusBadgeClass(status)}`}>
                    {status.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-slate-200 dark:bg-light-navy-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-smooth"
                      style={{ width: `${(count / totalEmployees) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-green-600 min-w-[20px]">{count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contract Types */}
        <Card className="card-navy">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-purple-600" />
              <span>Contract Types</span>
            </CardTitle>
            <CardDescription>Employee distribution by contract type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(contractTypeBreakdown).map(([contractType, count]) => (
              <div key={contractType} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${getContractBadgeClass(contractType)}`}>
                    {contractType}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-slate-200 dark:bg-light-navy-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-smooth"
                      style={{ width: `${(count / totalEmployees) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-purple-600 min-w-[20px]">{count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Employees */}
      <Card className="card-navy">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-soft-blue-600" />
            <span>Recent Employees</span>
          </CardTitle>
          <CardDescription>Sample employee data with TypeScript type safety</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEmployees.slice(0, 3).map((employee) => (
              <div key={employee.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-light-navy-800 rounded-lg border border-slate-200 dark:border-light-navy-700 card-hover">
                <div className="flex-1 space-y-2 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <h3 className="font-semibold text-light-navy-900 dark:text-white">
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-0">
                      <Badge className={`text-xs ${getStatusBadgeClass(employee.status)}`}>
                        {employee.status.replace('-', ' ')}
                      </Badge>
                      <Badge className={`text-xs ${getContractBadgeClass(employee.contractType)}`}>
                        {employee.contractType}
                      </Badge>
                      {employee.probation && (
                        <Badge className="text-xs status-probation">
                          Probation
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center space-x-1 mb-1">
                      <Building2 className="h-3 w-3" />
                      <span>{employee.role} • {employee.department}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span className="text-xs">{employee.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span className="text-xs">{employee.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs">Hired {new Date(employee.hireDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

