import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Employee, Department, Role, FilterOptions, EmployeeFormData } from '../types';

interface EmployeeState {
  employees: Employee[];
  departments: Department[];
  roles: Role[];
  selectedEmployee: Employee | null;
  filters: FilterOptions;
  loading: boolean;
  error: string | null;
}

type EmployeeAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_EMPLOYEES'; payload: Employee[] }
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_EMPLOYEE'; payload: Employee }
  | { type: 'DELETE_EMPLOYEE'; payload: string }
  | { type: 'SET_SELECTED_EMPLOYEE'; payload: Employee | null }
  | { type: 'SET_DEPARTMENTS'; payload: Department[] }
  | { type: 'SET_ROLES'; payload: Role[] }
  | { type: 'SET_FILTERS'; payload: FilterOptions }
  | { type: 'CLEAR_FILTERS' };

const initialState: EmployeeState = {
  employees: [],
  departments: [],
  roles: [],
  selectedEmployee: null,
  filters: {},
  loading: false,
  error: null,
};

function employeeReducer(state: EmployeeState, action: EmployeeAction): EmployeeState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_EMPLOYEES':
      return { ...state, employees: action.payload, loading: false };
    case 'ADD_EMPLOYEE':
      return { ...state, employees: [...state.employees, action.payload] };
    case 'UPDATE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.map(emp =>
          emp.id === action.payload.id ? action.payload : emp
        ),
      };
    case 'DELETE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.filter(emp => emp.id !== action.payload),
      };
    case 'SET_SELECTED_EMPLOYEE':
      return { ...state, selectedEmployee: action.payload };
    case 'SET_DEPARTMENTS':
      return { ...state, departments: action.payload };
    case 'SET_ROLES':
      return { ...state, roles: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'CLEAR_FILTERS':
      return { ...state, filters: {} };
    default:
      return state;
  }
}

interface EmployeeContextType {
  state: EmployeeState;
  dispatch: React.Dispatch<EmployeeAction>;
  addEmployee: (employeeData: EmployeeFormData) => Promise<void>;
  updateEmployee: (id: string, employeeData: EmployeeFormData) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  getEmployeeById: (id: string) => Employee | undefined;
  getFilteredEmployees: () => Employee[];
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(employeeReducer, initialState);

  const addEmployee = async (employeeData: EmployeeFormData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const newEmployee: Employee = {
        id: generateId(),
        ...employeeData,
        hireDate: new Date(employeeData.hireDate),
        probationEndDate: employeeData.probationEndDate ? new Date(employeeData.probationEndDate) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dispatch({ type: 'ADD_EMPLOYEE', payload: newEmployee });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add employee' });
    }
  };

  const updateEmployee = async (id: string, employeeData: EmployeeFormData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const existingEmployee = state.employees.find(emp => emp.id === id);
      if (!existingEmployee) {
        throw new Error('Employee not found');
      }

      const updatedEmployee: Employee = {
        ...existingEmployee,
        ...employeeData,
        hireDate: new Date(employeeData.hireDate),
        probationEndDate: employeeData.probationEndDate ? new Date(employeeData.probationEndDate) : undefined,
        updatedAt: new Date(),
      };

      dispatch({ type: 'UPDATE_EMPLOYEE', payload: updatedEmployee });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update employee' });
    }
  };

  const deleteEmployee = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'DELETE_EMPLOYEE', payload: id });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete employee' });
    }
  };

  const getEmployeeById = (id: string): Employee | undefined => {
    return state.employees.find(emp => emp.id === id);
  };

  const getFilteredEmployees = (): Employee[] => {
    let filtered = [...state.employees];

    if (state.filters.department) {
      filtered = filtered.filter(emp => emp.departmentId === state.filters.department);
    }

    if (state.filters.role) {
      filtered = filtered.filter(emp => emp.roleId === state.filters.role);
    }

    if (state.filters.status) {
      filtered = filtered.filter(emp => emp.status === state.filters.status);
    }

    if (state.filters.contractType) {
      filtered = filtered.filter(emp => emp.contractType === state.filters.contractType);
    }

    if (state.filters.searchTerm) {
      const searchTerm = state.filters.searchTerm.toLowerCase();
      filtered = filtered.filter(emp =>
        emp.firstName.toLowerCase().includes(searchTerm) ||
        emp.lastName.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm) ||
        emp.id.toLowerCase().includes(searchTerm)
      );
    }

    // Sort results
    if (state.filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: string | Date;
        let bValue: string | Date;

        switch (state.filters.sortBy) {
          case 'name':
            aValue = `${a.firstName} ${a.lastName}`;
            bValue = `${b.firstName} ${b.lastName}`;
            break;
          case 'hireDate':
            aValue = a.hireDate;
            bValue = b.hireDate;
            break;
          case 'department':
            const aDept = state.departments.find(d => d.id === a.departmentId);
            const bDept = state.departments.find(d => d.id === b.departmentId);
            aValue = aDept?.name || '';
            bValue = bDept?.name || '';
            break;
          case 'role':
            const aRole = state.roles.find(r => r.id === a.roleId);
            const bRole = state.roles.find(r => r.id === b.roleId);
            aValue = aRole?.title || '';
            bValue = bRole?.title || '';
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return state.filters.sortOrder === 'desc' ? 1 : -1;
        if (aValue > bValue) return state.filters.sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    return filtered;
  };

  const value: EmployeeContextType = {
    state,
    dispatch,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    getFilteredEmployees,
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployee(): EmployeeContextType {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
}

function generateId(): string {
  return `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

