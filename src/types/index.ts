// Core type definitions for Employee Management Dashboard

export type EmployeeStatus = 'active' | 'inactive' | 'terminated' | 'on-leave';
export type ContractType = 'permanent' | 'contract' | 'intern';
export type UserRole = 'admin' | 'hr_manager' | 'viewer';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  parentDepartment?: Department;
  managerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  title: string;
  description?: string;
  level: number;
  departmentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hireDate: Date;
  departmentId: string;
  roleId: string;
  supervisorId?: string;
  status: EmployeeStatus;
  contractType: ContractType;
  probationEndDate?: Date;
  emergencyContact: EmergencyContact;
  profilePhoto?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  employeeId?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface FilterOptions {
  department?: string;
  role?: string;
  status?: EmployeeStatus;
  contractType?: ContractType;
  searchTerm?: string;
  sortBy?: 'name' | 'hireDate' | 'department' | 'role';
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  departmentBreakdown: { [key: string]: number };
  statusBreakdown: { [key: string]: number };
  contractTypeBreakdown: { [key: string]: number };
  newHires: Employee[];
  probationEmployees: Employee[];
}

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hireDate: string;
  departmentId: string;
  roleId: string;
  supervisorId?: string;
  status: EmployeeStatus;
  contractType: ContractType;
  probationEndDate?: string;
  emergencyContact: EmergencyContact;
  profilePhoto?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: ValidationError[];
}

