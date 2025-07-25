import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  SortAsc,
  SortDesc,
  X,
  Users,
  Download
} from 'lucide-react';

// Mock data
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

export function EmployeeListDemo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [contractFilter, setContractFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'hireDate' | 'department' | 'role'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  const departments = [...new Set(mockEmployees.map(emp => emp.department))];
  const statuses = [...new Set(mockEmployees.map(emp => emp.status))];
  const contractTypes = [...new Set(mockEmployees.map(emp => emp.contractType))];

  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = mockEmployees.filter(emp => {
      const matchesSearch = searchTerm === '' || 
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = departmentFilter === '' || emp.department === departmentFilter;
      const matchesStatus = statusFilter === '' || emp.status === statusFilter;
      const matchesContract = contractFilter === '' || emp.contractType === contractFilter;

      return matchesSearch && matchesDepartment && matchesStatus && matchesContract;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
          break;
        case 'hireDate':
          aValue = new Date(a.hireDate);
          bValue = new Date(b.hireDate);
          break;
        case 'department':
          aValue = a.department;
          bValue = b.department;
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'desc' ? 1 : -1;
      if (aValue > bValue) return sortOrder === 'desc' ? -1 : 1;
      return 0;
    });

    return filtered;
  }, [searchTerm, departmentFilter, statusFilter, contractFilter, sortBy, sortOrder]);

  const handleSort = (column: 'name' | 'hireDate' | 'department' | 'role') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setStatusFilter('');
    setContractFilter('');
  };

  const hasActiveFilters = searchTerm || departmentFilter || statusFilter || contractFilter;

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

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage and view all employee records ({filteredAndSortedEmployees.length} of {mockEmployees.length})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button asChild>
            <Link to="/employees/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filter
              </CardTitle>
              <CardDescription>
                Find employees by name, email, or ID
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={contractFilter} onValueChange={setContractFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Contract Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {contractTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {departmentFilter && (
                <Badge variant="secondary" className="gap-1">
                  Department: {departmentFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setDepartmentFilter('')} />
                </Badge>
              )}
              {statusFilter && (
                <Badge variant="secondary" className="gap-1">
                  Status: {statusFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setStatusFilter('')} />
                </Badge>
              )}
              {contractFilter && (
                <Badge variant="secondary" className="gap-1">
                  Contract: {contractFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setContractFilter('')} />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Employee List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAndSortedEmployees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No employees found</h3>
              <p className="text-muted-foreground mb-4">
                {hasActiveFilters 
                  ? 'Try adjusting your search criteria or filters'
                  : 'Get started by adding your first employee'
                }
              </p>
              {!hasActiveFilters && (
                <Button asChild>
                  <Link to="/employees/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-7 gap-4 p-3 bg-muted/50 rounded-lg text-sm font-medium">
                <button 
                  className="flex items-center gap-2 text-left hover:text-primary"
                  onClick={() => handleSort('name')}
                >
                  Name {getSortIcon('name')}
                </button>
                <div>Contact</div>
                <button 
                  className="flex items-center gap-2 text-left hover:text-primary"
                  onClick={() => handleSort('department')}
                >
                  Department {getSortIcon('department')}
                </button>
                <button 
                  className="flex items-center gap-2 text-left hover:text-primary"
                  onClick={() => handleSort('role')}
                >
                  Role {getSortIcon('role')}
                </button>
                <div>Status</div>
                <button 
                  className="flex items-center gap-2 text-left hover:text-primary"
                  onClick={() => handleSort('hireDate')}
                >
                  Hire Date {getSortIcon('hireDate')}
                </button>
                <div className="text-right">Actions</div>
              </div>

              {/* Table Rows */}
              {filteredAndSortedEmployees.map((employee) => (
                <div key={employee.id} className="grid grid-cols-7 gap-4 p-3 border rounded-lg hover:bg-muted/50">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {employee.firstName} {employee.lastName}
                      {employee.probation && (
                        <Badge variant="outline" className="text-xs">Probation</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">ID: {employee.id}</div>
                  </div>
                  <div>
                    <div className="text-sm">{employee.email}</div>
                    <div className="text-sm text-muted-foreground">{employee.phone}</div>
                  </div>
                  <div className="text-sm">{employee.department}</div>
                  <div className="text-sm">{employee.role}</div>
                  <div>
                    <Badge className={getStatusColor(employee.status)}>
                      {employee.status.replace('-', ' ')}
                    </Badge>
                    <div className="mt-1">
                      <Badge className={getContractTypeColor(employee.contractType)} variant="outline">
                        {employee.contractType}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm">
                    {new Date(employee.hireDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/employees/${employee.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

