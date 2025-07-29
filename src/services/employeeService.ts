import { Employee } from '../types';

const STORAGE_KEY = 'employee_management_data';

// Mock initial data
const initialEmployees: Employee[] = [
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
    supervisor: 'emp_7',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1-555-0102',
      email: 'jane.doe@email.com',
    },
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
    emergencyContact: {
      name: 'Mike Johnson',
      relationship: 'Husband',
      phone: '+1-555-0202',
      email: 'mike.johnson@email.com',
    },
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
    supervisor: 'emp_1',
    emergencyContact: {
      name: 'Lisa Chen',
      relationship: 'Sister',
      phone: '+1-555-0302',
      email: 'lisa.chen@email.com',
    },
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
    emergencyContact: {
      name: 'Carlos Rodriguez',
      relationship: 'Father',
      phone: '+1-555-0402',
      email: 'carlos.rodriguez@email.com',
    },
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
    supervisor: 'emp_6',
    emergencyContact: {
      name: 'Mary Wilson',
      relationship: 'Mother',
      phone: '+1-555-0502',
      email: 'mary.wilson@email.com',
    },
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
    emergencyContact: {
      name: 'Robert Brown',
      relationship: 'Spouse',
      phone: '+1-555-0602',
      email: 'robert.brown@email.com',
    },
  },
];

export class EmployeeService {
  private static instance: EmployeeService;
  private employees: Employee[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): EmployeeService {
    if (!EmployeeService.instance) {
      EmployeeService.instance = new EmployeeService();
    }
    return EmployeeService.instance;
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.employees = JSON.parse(stored);
      } else {
        // Initialize with mock data if no stored data exists
        this.employees = initialEmployees;
        this.saveToStorage();
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      this.employees = initialEmployees;
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.employees));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private generateId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `emp_${timestamp}_${random}`;
  }


  public getAllEmployees(): Employee[] {
    return [...this.employees];
  }

  public getEmployeeById(id: string): Employee | undefined {
    return this.employees.find(emp => emp.id === id);
  }

  public createEmployee(employeeData: Omit<Employee, 'id'>): Employee {
    const newEmployee: Employee = {
      ...employeeData,
      id: this.generateId(),
    };

    this.employees.push(newEmployee);
    this.saveToStorage();
    return newEmployee;
  }

  public updateEmployee(id: string, updates: Partial<Omit<Employee, 'id'>>): Employee | null {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index === -1) return null;

    this.employees[index] = { ...this.employees[index], ...updates };
    this.saveToStorage();
    return this.employees[index];
  }

  public deleteEmployee(id: string): boolean {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index === -1) return false;

    this.employees.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Filtering and Search
  public searchEmployees(query: string): Employee[] {
    if (!query.trim()) return this.getAllEmployees();

    const searchTerm = query.toLowerCase();
    return this.employees.filter(emp =>
      emp.firstName.toLowerCase().includes(searchTerm) ||
      emp.lastName.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm) ||
      emp.id.toLowerCase().includes(searchTerm) ||
      emp.department.toLowerCase().includes(searchTerm) ||
      emp.role.toLowerCase().includes(searchTerm)
    );
  }

  public filterEmployees(filters: {
    department?: string;
    status?: string;
    contractType?: string;
    probation?: boolean;
  }): Employee[] {
    return this.employees.filter(emp => {
      if (filters.department && emp.department !== filters.department) return false;
      if (filters.status && emp.status !== filters.status) return false;
      if (filters.contractType && emp.contractType !== filters.contractType) return false;
      if (filters.probation !== undefined && emp.probation !== filters.probation) return false;
      return true;
    });
  }

  // Statistics
  public getStatistics() {
    const total = this.employees.length;
    const active = this.employees.filter(emp => emp.status === 'active').length;
    const onProbation = this.employees.filter(emp => emp.probation).length;
    
    // New hires in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newHires = this.employees.filter(emp => 
      new Date(emp.hireDate) >= thirtyDaysAgo
    ).length;

    // Department breakdown
    const departmentBreakdown: Record<string, number> = {};
    this.employees.forEach(emp => {
      departmentBreakdown[emp.department] = (departmentBreakdown[emp.department] || 0) + 1;
    });

    // Status breakdown
    const statusBreakdown: Record<string, number> = {};
    this.employees.forEach(emp => {
      statusBreakdown[emp.status] = (statusBreakdown[emp.status] || 0) + 1;
    });

    // Contract type breakdown
    const contractTypeBreakdown: Record<string, number> = {};
    this.employees.forEach(emp => {
      contractTypeBreakdown[emp.contractType] = (contractTypeBreakdown[emp.contractType] || 0) + 1;
    });

    return {
      totalEmployees: total,
      activeEmployees: active,
      newHires,
      probationEmployees: onProbation,
      departmentBreakdown,
      statusBreakdown,
      contractTypeBreakdown,
    };
  }

  // Export functionality
  public exportToJSON(): string {
    return JSON.stringify(this.employees, null, 2);
  }

  public exportToCSV(): string {
    if (this.employees.length === 0) return '';

    const headers = [
      'ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Department', 'Role',
      'Status', 'Contract Type', 'Hire Date', 'Probation', 'Probation End Date',
      'Supervisor', 'Emergency Contact Name', 'Emergency Contact Relationship',
      'Emergency Contact Phone', 'Emergency Contact Email'
    ];

    const csvRows = [
      headers.join(','),
      ...this.employees.map(emp => [
        emp.id,
        emp.firstName,
        emp.lastName,
        emp.email,
        emp.phone,
        emp.department,
        emp.role,
        emp.status,
        emp.contractType,
        emp.hireDate,
        emp.probation ? 'Yes' : 'No',
        emp.probationEndDate || '',
        emp.supervisor || '',
        emp.emergencyContact?.name || '',
        emp.emergencyContact?.relationship || '',
        emp.emergencyContact?.phone || '',
        emp.emergencyContact?.email || ''
      ].map(field => `"${field}"`).join(','))
    ];

    return csvRows.join('\n');
  }

  // Data management
  public clearAllData(): void {
    this.employees = [];
    this.saveToStorage();
  }

  public resetToInitialData(): void {
    this.employees = [...initialEmployees];
    this.saveToStorage();
  }

  public importFromJSON(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData);
      if (Array.isArray(imported)) {
        this.employees = imported;
        this.saveToStorage();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing JSON:', error);
      return false;
    }
  }
}

