import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Moon, 
  Sun, 
  Users, 
  UserPlus, 
  LayoutDashboard, 
  Menu,
  X,
  Building2,
  CheckCircle
} from 'lucide-react';

// Employee interface
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  status: string;
  hireDate: string;
}

// Initial mock data
const initialEmployees: Employee[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@company.com', department: 'Engineering', role: 'Senior Software Engineer', status: 'Active', hireDate: '2023-01-15' },
  { id: 2, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@company.com', department: 'Human Resources', role: 'HR Manager', status: 'Active', hireDate: '2022-08-20' },
  { id: 3, firstName: 'Michael', lastName: 'Chen', email: 'michael.chen@company.com', department: 'Engineering', role: 'Software Engineer', status: 'Active', hireDate: '2023-03-10' },
  { id: 4, firstName: 'Emily', lastName: 'Rodriguez', email: 'emily.rodriguez@company.com', department: 'Marketing', role: 'Marketing Specialist', status: 'Active', hireDate: '2023-06-01' },
  { id: 5, firstName: 'David', lastName: 'Wilson', email: 'david.wilson@company.com', department: 'Sales', role: 'Sales Representative', status: 'Active', hireDate: '2023-04-15' },
  { id: 6, firstName: 'Jessica', lastName: 'Brown', email: 'jessica.brown@company.com', department: 'Finance', role: 'Financial Analyst', status: 'On Leave', hireDate: '2022-11-30' },
];

// Employee Context
const EmployeeContext = React.createContext<{
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: number, employee: Partial<Employee>) => void;
  deleteEmployee: (id: number) => void;
}>({
  employees: [],
  addEmployee: () => {},
  updateEmployee: () => {},
  deleteEmployee: () => {},
});

// Employee Provider
function EmployeeProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  const addEmployee = (employeeData: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: Math.max(...employees.map(e => e.id), 0) + 1,
    };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const updateEmployee = (id: number, employeeData: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...employeeData } : emp));
  };

  const deleteEmployee = (id: number) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, updateEmployee, deleteEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
}

// Dashboard Component
function Dashboard() {
  const { employees } = React.useContext(EmployeeContext);
  
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
  const newHires = employees.filter(emp => {
    const hireDate = new Date(emp.hireDate);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return hireDate > threeMonthsAgo;
  }).length;
  const onProbation = employees.filter(emp => emp.status === 'Probation').length;

  const departmentCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
              <p className="text-2xl font-bold text-navy-800 dark:text-white">{totalEmployees}</p>
            </div>
            <Users className="h-8 w-8 text-soft-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-navy-800 dark:text-white">{activeEmployees}</p>
            </div>
            <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New Hires</p>
              <p className="text-2xl font-bold text-navy-800 dark:text-white">{newHires}</p>
            </div>
            <UserPlus className="h-8 w-8 text-soft-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">On Probation</p>
              <p className="text-2xl font-bold text-navy-800 dark:text-white">{onProbation}</p>
            </div>
            <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-orange-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-navy-800 dark:text-white mb-4">Department Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(departmentCounts).map(([department, count]) => (
            <div key={department} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">{department}</span>
              <span className="text-sm font-semibold text-navy-800 dark:text-white">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Employees List Component
function EmployeesList() {
  const { employees } = React.useContext(EmployeeContext);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-navy-800 dark:text-white">All Employees</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage your team members</p>
        </div>
        <Link
          to="/employees/new"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-soft-blue-500 hover:bg-soft-blue-600 text-white text-sm font-medium rounded-md transition-colors duration-200 shadow-sm"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Employee
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy-800 dark:text-white">
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {employee.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {employee.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      employee.status === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : employee.status === 'On Leave'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Add Employee Form Component
function AddEmployee() {
  const navigate = useNavigate();
  const { addEmployee } = React.useContext(EmployeeContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    role: '',
    status: 'Active',
    hireDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addEmployee(formData);
      setShowSuccess(true);
      
      // Show success message briefly, then redirect
      setTimeout(() => {
        navigate('/employees');
      }, 1500);
      
    } catch (error) {
      console.error('Error adding employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 animate-fade-in">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-navy-800 dark:text-white mb-2">Employee Added Successfully!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {formData.firstName} {formData.lastName} has been added to the system.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to employee list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-navy-800 dark:text-white">Add New Employee</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Enter employee information to add them to the system</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-soft-blue-500 focus:border-soft-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 ${
                  errors.firstName 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter first name"
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-soft-blue-500 focus:border-soft-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 ${
                  errors.lastName 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter last name"
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-soft-blue-500 focus:border-soft-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 ${
                errors.email 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter email address"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-soft-blue-500 focus:border-soft-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 ${
                  errors.department 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
              {errors.department && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.department}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role *
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-soft-blue-500 focus:border-soft-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 ${
                  errors.role 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g., Software Engineer, Manager"
              />
              {errors.role && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-soft-blue-500 focus:border-soft-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              >
                <option value="Active">Active</option>
                <option value="Probation">Probation</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hire Date
              </label>
              <input
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-soft-blue-500 focus:border-soft-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/employees"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-soft-blue-500 transition-colors duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-soft-blue-500 border border-transparent rounded-md shadow-sm hover:bg-soft-blue-600 focus:outline-none focus:ring-2 focus:ring-soft-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? 'Adding Employee...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Navigation Component
function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/employees', icon: Users, label: 'Employees' },
    { path: '/employees/new', icon: UserPlus, label: 'Add Employee' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-br from-navy-600 to-soft-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-navy-800 dark:text-white">HR Dashboard</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Employee Management</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-xl animate-slide-in">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-br from-navy-600 to-soft-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy-800 dark:text-white">HR Dashboard</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Employee Management</p>
                </div>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'bg-soft-blue-100 dark:bg-soft-blue-900 text-soft-blue-800 dark:text-soft-blue-200'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="h-10 w-10 bg-gradient-to-br from-navy-600 to-soft-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy-800 dark:text-white">HR Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Employee Management</p>
            </div>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-soft-blue-100 dark:bg-soft-blue-900 text-soft-blue-800 dark:text-soft-blue-200'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <EmployeeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
          <Navigation />
          
          <div className="lg:pl-64">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
              <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Routes>
                      <Route path="/dashboard" element={
                        <div>
                          <h1 className="text-2xl font-bold text-navy-800 dark:text-white">Dashboard</h1>
                          <p className="text-gray-600 dark:text-gray-300">Overview of your employee management system</p>
                        </div>
                      } />
                      <Route path="/employees" element={
                        <div>
                          <h1 className="text-2xl font-bold text-navy-800 dark:text-white">Employee Management</h1>
                          <p className="text-gray-600 dark:text-gray-300">Manage and view all employee records</p>
                        </div>
                      } />
                      <Route path="/employees/new" element={
                        <div>
                          <h1 className="text-2xl font-bold text-navy-800 dark:text-white">Add New Employee</h1>
                          <p className="text-gray-600 dark:text-gray-300">Add a new employee to the system</p>
                        </div>
                      } />
                    </Routes>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    {darkMode ? (
                      <Sun className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <main className="px-4 sm:px-6 lg:px-8 py-6">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/employees" element={<EmployeesList />} />
                <Route path="/employees/new" element={<AddEmployee />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </EmployeeProvider>
  );
}

export default App;

