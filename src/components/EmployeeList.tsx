import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEmployee } from '../contexts/EmployeeContext';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { Employee, FilterOptions } from '../types';
import { mockDepartments, mockRoles } from '../services/mockData';

export function EmployeeList() {
  const { state, dispatch, deleteEmployee, getFilteredEmployees } = useEmployee();
  const { employees, loading, error } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);

  // Initialize data
  useEffect(() => {
    dispatch({ type: 'SET_DEPARTMENTS', payload: mockDepartments });
    dispatch({ type: 'SET_ROLES', payload: mockRoles });
    dispatch({ type: 'SET_EMPLOYEES', payload: JSON.parse(localStorage.getItem('employees') || '[]') });
  }, [dispatch]);

  // Update filters when search term changes
  useEffect(() => {
    const newFilters = { ...filters, searchTerm };
    setFilters(newFilters);
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  }, [searchTerm]);

  const handleFilterChange = (key: keyof FilterOptions, value: string | undefined) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const handleSort = (sortBy: 'name' | 'hireDate' | 'department' | 'role') => {
    const currentSortOrder = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    const newFilters = { ...filters, sortBy, sortOrder: currentSortOrder };
    setFilters(newFilters);
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  };

  const handleDelete = async (id: string) => {
    await deleteEmployee(id);
    // Update localStorage
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  const exportToCSV = () => {
    const filteredEmployees = getFilteredEmployees();
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Department', 'Role', 'Status', 'Contract Type', 'Hire Date'];
    const csvContent = [
      headers.join(','),
      ...filteredEmployees.map(emp => {
        const department = mockDepartments.find(d => d.id === emp.departmentId)?.name || '';
        const role = mockRoles.find(r => r.id === emp.roleId)?.title || '';
        return [
          emp.id,
          `\"${emp.firstName} ${emp.lastName}\"`,
          emp.email,
          emp.phone,
          department,
          role,
          emp.status,
          emp.contractType,
          emp.hireDate.toLocaleDateString()
        ].join(',');
      })
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
    if (filters.sortBy !== column) return null;
    return filters.sortOrder === 'asc' ? <SortAsc className=\"h-4 w-4\" /> : <SortDesc className=\"h-4 w-4\" />;
  };

  const filteredEmployees = getFilteredEmployees();
  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  if (loading) {
    return <div className=\"flex items-center justify-center h-64\">Loading...</div>;
  }

  if (error) {
    return <div className=\"text-red-500 text-center\">{error}</div>;
  }

  return (
    <div className=\"space-y-6\">
      {/* Header */}
      <div className=\"flex items-center justify-between\">
        <div>
          <h1 className=\"text-3xl font-bold tracking-tight\">Employees</h1>
          <p className=\"text-muted-foreground\">
            Manage and view all employee records ({filteredEmployees.length} of {employees.length})
          </p>
        </div>
        <div className=\"flex items-center gap-2\">
          <Button onClick={exportToCSV} variant=\"outline\" size=\"sm\">
            <Download className=\"h-4 w-4 mr-2\" />
            Export CSV
          </Button>
          <Button asChild>
            <Link to=\"/employees/new\">
              <Plus className=\"h-4 w-4 mr-2\" />
              Add Employee
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className=\"flex items-center justify-between\">
            <div>
              <CardTitle className=\"flex items-center gap-2\">
                <Search className=\"h-5 w-5\" />
                Search & Filter
              </CardTitle>
              <CardDescription>
                Find employees by name, email, or ID
              </CardDescription>
            </div>
            <Button
              variant=\"outline\"
              size=\"sm\"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className=\"h-4 w-4 mr-2\" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className=\"space-y-4\">
          {/* Search Bar */}
          <div className=\"relative\">
            <Search className=\"absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground\" />
            <Input
              placeholder=\"Search by name, email, or ID...\"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className=\"pl-10\"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className=\"grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg\">
              <Select
                value={filters.department || ''}
                onValueChange={(value) => handleFilterChange('department', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder=\"Department\" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=\"\">All Departments</SelectItem>
                  {mockDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.role || ''}
                onValueChange={(value) => handleFilterChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder=\"Role\" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=\"\">All Roles</SelectItem>
                  {mockRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.status || ''}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder=\"Status\" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=\"\">All Statuses</SelectItem>
                  <SelectItem value=\"active\">Active</SelectItem>
                  <SelectItem value=\"inactive\">Inactive</SelectItem>
                  <SelectItem value=\"on-leave\">On Leave</SelectItem>
                  <SelectItem value=\"terminated\">Terminated</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.contractType || ''}
                onValueChange={(value) => handleFilterChange('contractType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder=\"Contract Type\" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=\"\">All Types</SelectItem>
                  <SelectItem value=\"permanent\">Permanent</SelectItem>
                  <SelectItem value=\"contract\">Contract</SelectItem>
                  <SelectItem value=\"intern\">Intern</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className=\"flex items-center gap-2 flex-wrap\">
              <span className=\"text-sm text-muted-foreground\">Active filters:</span>
              {filters.department && (
                <Badge variant=\"secondary\" className=\"gap-1\">
                  Department: {mockDepartments.find(d => d.id === filters.department)?.name}
                  <X 
                    className=\"h-3 w-3 cursor-pointer\" 
                    onClick={() => handleFilterChange('department', undefined)}
                  />
                </Badge>
              )}
              {filters.role && (
                <Badge variant=\"secondary\" className=\"gap-1\">
                  Role: {mockRoles.find(r => r.id === filters.role)?.title}
                  <X 
                    className=\"h-3 w-3 cursor-pointer\" 
                    onClick={() => handleFilterChange('role', undefined)}
                  />
                </Badge>
              )}
              {filters.status && (
                <Badge variant=\"secondary\" className=\"gap-1\">
                  Status: {filters.status}
                  <X 
                    className=\"h-3 w-3 cursor-pointer\" 
                    onClick={() => handleFilterChange('status', undefined)}
                  />
                </Badge>
              )}
              {filters.contractType && (
                <Badge variant=\"secondary\" className=\"gap-1\">
                  Contract: {filters.contractType}
                  <X 
                    className=\"h-3 w-3 cursor-pointer\" 
                    onClick={() => handleFilterChange('contractType', undefined)}
                  />
                </Badge>
              )}
              <Button variant=\"ghost\" size=\"sm\" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle className=\"flex items-center gap-2\">
            <Users className=\"h-5 w-5\" />
            Employee List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <div className=\"text-center py-8\">
              <Users className=\"h-12 w-12 text-muted-foreground mx-auto mb-4\" />
              <h3 className=\"text-lg font-medium mb-2\">No employees found</h3>
              <p className=\"text-muted-foreground mb-4\">
                {hasActiveFilters 
                  ? 'Try adjusting your search criteria or filters'
                  : 'Get started by adding your first employee'
                }
              </p>
              {!hasActiveFilters && (
                <Button asChild>
                  <Link to=\"/employees/new\">
                    <Plus className=\"h-4 w-4 mr-2\" />
                    Add Employee
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className=\"cursor-pointer hover:bg-muted/50\"
                    onClick={() => handleSort('name')}
                  >
                    <div className=\"flex items-center gap-2\">
                      Name
                      {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead 
                    className=\"cursor-pointer hover:bg-muted/50\"
                    onClick={() => handleSort('department')}
                  >
                    <div className=\"flex items-center gap-2\">
                      Department
                      {getSortIcon('department')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className=\"cursor-pointer hover:bg-muted/50\"
                    onClick={() => handleSort('role')}
                  >
                    <div className=\"flex items-center gap-2\">
                      Role
                      {getSortIcon('role')}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead 
                    className=\"cursor-pointer hover:bg-muted/50\"
                    onClick={() => handleSort('hireDate')}
                  >
                    <div className=\"flex items-center gap-2\">
                      Hire Date
                      {getSortIcon('hireDate')}
                    </div>
                  </TableHead>
                  <TableHead className=\"text-right\">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => {
                  const department = mockDepartments.find(d => d.id === employee.departmentId);
                  const role = mockRoles.find(r => r.id === employee.roleId);
                  const isOnProbation = employee.probationEndDate && employee.probationEndDate > new Date();
                  
                  return (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div>
                          <div className=\"font-medium\">
                            {employee.firstName} {employee.lastName}
                            {isOnProbation && (
                              <Badge variant=\"outline\" className=\"ml-2 text-xs\">
                                Probation
                              </Badge>
                            )}
                          </div>
                          <div className=\"text-sm text-muted-foreground\">
                            ID: {employee.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className=\"text-sm\">{employee.email}</div>
                          <div className=\"text-sm text-muted-foreground\">{employee.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{department?.name}</TableCell>
                      <TableCell>{role?.title}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getContractTypeColor(employee.contractType)}>
                          {employee.contractType}
                        </Badge>
                      </TableCell>
                      <TableCell>{employee.hireDate.toLocaleDateString()}</TableCell>
                      <TableCell className=\"text-right\">
                        <div className=\"flex items-center justify-end gap-2\">
                          <Button variant=\"ghost\" size=\"sm\" asChild>
                            <Link to={`/employees/${employee.id}/edit`}>
                              <Edit className=\"h-4 w-4\" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant=\"ghost\" size=\"sm\">
                                <Trash2 className=\"h-4 w-4\" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {employee.firstName} {employee.lastName}? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(employee.id)}
                                  className=\"bg-destructive text-destructive-foreground hover:bg-destructive/90\"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

