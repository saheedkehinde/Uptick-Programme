import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Employee } from '../types';
import { EmployeeService } from '../services/employeeService';

interface EmployeeContextType {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  
  // CRUD operations
  createEmployee: (employee: Omit<Employee, 'id'>) => Promise<Employee>;
  updateEmployee: (id: string, updates: Partial<Omit<Employee, 'id'>>) => Promise<Employee | null>;
  deleteEmployee: (id: string) => Promise<boolean>;
  getEmployeeById: (id: string) => Employee | undefined;
  
  // Search and filter
  searchEmployees: (query: string) => Employee[];
  filterEmployees: (filters: {
    department?: string;
    status?: string;
    contractType?: string;
    probation?: boolean;
  }) => Employee[];
  
  // Statistics
  getStatistics: () => {
    totalEmployees: number;
    activeEmployees: number;
    newHires: number;
    probationEmployees: number;
    departmentBreakdown: Record<string, number>;
    statusBreakdown: Record<string, number>;
    contractTypeBreakdown: Record<string, number>;
  };
  
  // Export
  exportToJSON: () => string;
  exportToCSV: () => string;
  
  // Data management
  refreshData: () => void;
  clearAllData: () => void;
  resetToInitialData: () => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

interface EmployeeProviderProps {
  children: ReactNode;
}

export function EmployeeProviderWithPersistence({ children }: EmployeeProviderProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const employeeService = EmployeeService.getInstance();

  const refreshData = () => {
    try {
      setLoading(true);
      setError(null);
      const data = employeeService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const createEmployee = async (employeeData: Omit<Employee, 'id'>): Promise<Employee> => {
    try {
      setError(null);
      const newEmployee = employeeService.createEmployee(employeeData);
      refreshData(); // Refresh to get updated data
      return newEmployee;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Omit<Employee, 'id'>>): Promise<Employee | null> => {
    try {
      setError(null);
      const updatedEmployee = employeeService.updateEmployee(id, updates);
      if (updatedEmployee) {
        refreshData(); // Refresh to get updated data
      }
      return updatedEmployee;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteEmployee = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = employeeService.deleteEmployee(id);
      if (success) {
        refreshData(); // Refresh to get updated data
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getEmployeeById = (id: string): Employee | undefined => {
    return employeeService.getEmployeeById(id);
  };

  const searchEmployees = (query: string): Employee[] => {
    return employeeService.searchEmployees(query);
  };

  const filterEmployees = (filters: {
    department?: string;
    status?: string;
    contractType?: string;
    probation?: boolean;
  }): Employee[] => {
    return employeeService.filterEmployees(filters);
  };

  const getStatistics = () => {
    return employeeService.getStatistics();
  };

  const exportToJSON = (): string => {
    return employeeService.exportToJSON();
  };

  const exportToCSV = (): string => {
    return employeeService.exportToCSV();
  };

  const clearAllData = () => {
    employeeService.clearAllData();
    refreshData();
  };

  const resetToInitialData = () => {
    employeeService.resetToInitialData();
    refreshData();
  };

  const contextValue: EmployeeContextType = {
    employees,
    loading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    searchEmployees,
    filterEmployees,
    getStatistics,
    exportToJSON,
    exportToCSV,
    refreshData,
    clearAllData,
    resetToInitialData,
  };

  return (
    <EmployeeContext.Provider value={contextValue}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees(): EmployeeContextType {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
}

