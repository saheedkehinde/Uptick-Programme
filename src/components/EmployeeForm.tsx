import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployee } from '../contexts/EmployeeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Building,
  Briefcase,
  AlertCircle,
  Upload,
  X
} from 'lucide-react';
import { EmployeeFormData, ValidationError, EmployeeStatus, ContractType } from '../types';
import { mockDepartments, mockRoles } from '../services/mockData';

export function EmployeeForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { state, dispatch, addEmployee, updateEmployee, getEmployeeById } = useEmployee();
  const { employees, loading, error } = state;
  
  const isEditing = Boolean(id);
  const existingEmployee = isEditing ? getEmployeeById(id!) : null;

  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    hireDate: '',
    departmentId: '',
    roleId: '',
    supervisorId: '',
    status: 'active' as EmployeeStatus,
    contractType: 'permanent' as ContractType,
    probationEndDate: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: '',
    },
    profilePhoto: '',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data
  useEffect(() => {
    dispatch({ type: 'SET_DEPARTMENTS', payload: mockDepartments });
    dispatch({ type: 'SET_ROLES', payload: mockRoles });
    dispatch({ type: 'SET_EMPLOYEES', payload: JSON.parse(localStorage.getItem('employees') || '[]') });

    if (isEditing && existingEmployee) {
      setFormData({
        firstName: existingEmployee.firstName,
        lastName: existingEmployee.lastName,
        email: existingEmployee.email,
        phone: existingEmployee.phone,
        hireDate: existingEmployee.hireDate.toISOString().split('T')[0],
        departmentId: existingEmployee.departmentId,
        roleId: existingEmployee.roleId,
        supervisorId: existingEmployee.supervisorId || '',
        status: existingEmployee.status,
        contractType: existingEmployee.contractType,
        probationEndDate: existingEmployee.probationEndDate 
          ? existingEmployee.probationEndDate.toISOString().split('T')[0] 
          : '',
        emergencyContact: existingEmployee.emergencyContact,
        profilePhoto: existingEmployee.profilePhoto || '',
      });
    }
  }, [dispatch, isEditing, existingEmployee]);

  const validateForm = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!formData.firstName.trim()) {
      errors.push({ field: 'firstName', message: 'First name is required' });
    }

    if (!formData.lastName.trim()) {
      errors.push({ field: 'lastName', message: 'Last name is required' });
    }

    if (!formData.email.trim()) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
      errors.push({ field: 'email', message: 'Invalid email format' });
    } else {
      // Check for duplicate email
      const existingEmailEmployee = employees.find(emp => 
        emp.email === formData.email && emp.id !== id
      );
      if (existingEmailEmployee) {
        errors.push({ field: 'email', message: 'Email already exists' });
      }
    }

    if (!formData.phone.trim()) {
      errors.push({ field: 'phone', message: 'Phone number is required' });
    }

    if (!formData.hireDate) {
      errors.push({ field: 'hireDate', message: 'Hire date is required' });
    }

    if (!formData.departmentId) {
      errors.push({ field: 'departmentId', message: 'Department is required' });
    }

    if (!formData.roleId) {
      errors.push({ field: 'roleId', message: 'Role is required' });
    }

    if (!formData.emergencyContact.name.trim()) {
      errors.push({ field: 'emergencyContact.name', message: 'Emergency contact name is required' });
    }

    if (!formData.emergencyContact.relationship.trim()) {
      errors.push({ field: 'emergencyContact.relationship', message: 'Emergency contact relationship is required' });
    }

    if (!formData.emergencyContact.phone.trim()) {
      errors.push({ field: 'emergencyContact.phone', message: 'Emergency contact phone is required' });
    }

    // Validate probation end date
    if (formData.probationEndDate) {
      const hireDate = new Date(formData.hireDate);
      const probationEndDate = new Date(formData.probationEndDate);
      if (probationEndDate <= hireDate) {
        errors.push({ field: 'probationEndDate', message: 'Probation end date must be after hire date' });
      }
    }

    return errors;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('emergencyContact.')) {
      const contactField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [contactField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear validation error for this field
    setValidationErrors(prev => prev.filter(error => error.field !== field));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setValidationErrors([]);

    try {
      if (isEditing) {
        await updateEmployee(id!, formData);
        // Update localStorage
        const updatedEmployees = employees.map(emp => 
          emp.id === id ? { ...emp, ...formData, hireDate: new Date(formData.hireDate) } : emp
        );
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      } else {
        await addEmployee(formData);
        // Update localStorage
        const newEmployee = {
          id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...formData,
          hireDate: new Date(formData.hireDate),
          probationEndDate: formData.probationEndDate ? new Date(formData.probationEndDate) : undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const updatedEmployees = [...employees, newEmployee];
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      }
      
      navigate('/employees');
    } catch (error) {
      console.error('Error saving employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return validationErrors.find(error => error.field === field)?.message;
  };

  const availableSupervisors = employees.filter(emp => 
    emp.id !== id && emp.status === 'active'
  );

  const departmentRoles = mockRoles.filter(role => 
    !formData.departmentId || role.departmentId === formData.departmentId
  );

  return (
    <div className=\"space-y-6\">
      {/* Header */}
      <div className=\"flex items-center gap-4\">
        <Button variant=\"ghost\" onClick={() => navigate('/employees')}>
          <ArrowLeft className=\"h-4 w-4 mr-2\" />
          Back to Employees
        </Button>
        <div>
          <h1 className=\"text-3xl font-bold tracking-tight\">
            {isEditing ? 'Edit Employee' : 'Add New Employee'}
          </h1>
          <p className=\"text-muted-foreground\">
            {isEditing 
              ? `Update information for ${existingEmployee?.firstName} ${existingEmployee?.lastName}`
              : 'Enter employee information to add them to the system'
            }
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant=\"destructive\">
          <AlertCircle className=\"h-4 w-4\" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className=\"space-y-6\">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className=\"flex items-center gap-2\">
              <User className=\"h-5 w-5\" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Basic employee details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className=\"space-y-4\">
            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
              <div className=\"space-y-2\">
                <Label htmlFor=\"firstName\">First Name *</Label>
                <Input
                  id=\"firstName\"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder=\"Enter first name\"
                />
                {getFieldError('firstName') && (
                  <p className=\"text-sm text-destructive\">{getFieldError('firstName')}</p>
                )}
              </div>

              <div className=\"space-y-2\">
                <Label htmlFor=\"lastName\">Last Name *</Label>
                <Input
                  id=\"lastName\"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder=\"Enter last name\"
                />
                {getFieldError('lastName') && (
                  <p className=\"text-sm text-destructive\">{getFieldError('lastName')}</p>
                )}
              </div>
            </div>

            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
              <div className=\"space-y-2\">
                <Label htmlFor=\"email\" className=\"flex items-center gap-2\">
                  <Mail className=\"h-4 w-4\" />
                  Email *
                </Label>
                <Input
                  id=\"email\"
                  type=\"email\"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder=\"Enter email address\"
                />
                {getFieldError('email') && (
                  <p className=\"text-sm text-destructive\">{getFieldError('email')}</p>
                )}
              </div>

              <div className=\"space-y-2\">
                <Label htmlFor=\"phone\" className=\"flex items-center gap-2\">
                  <Phone className=\"h-4 w-4\" />
                  Phone *
                </Label>
                <Input
                  id=\"phone\"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder=\"Enter phone number\"
                />
                {getFieldError('phone') && (
                  <p className=\"text-sm text-destructive\">{getFieldError('phone')}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle className=\"flex items-center gap-2\">
              <Briefcase className=\"h-5 w-5\" />
              Employment Information
            </CardTitle>
            <CardDescription>
              Job details and organizational structure
            </CardDescription>
          </CardHeader>
          <CardContent className=\"space-y-4\">
            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
              <div className=\"space-y-2\">
                <Label htmlFor=\"hireDate\" className=\"flex items-center gap-2\">
                  <Calendar className=\"h-4 w-4\" />
                  Hire Date *
                </Label>
                <Input
                  id=\"hireDate\"
                  type=\"date\"
                  value={formData.hireDate}
                  onChange={(e) => handleInputChange('hireDate', e.target.value)}
                />
                {getFieldError('hireDate') && (
                  <p className=\"text-sm text-destructive\">{getFieldError('hireDate')}</p>
                )}
              </div>

              <div className=\"space-y-2\">
                <Label htmlFor=\"probationEndDate\">Probation End Date</Label>
                <Input
                  id=\"probationEndDate\"
                  type=\"date\"
                  value={formData.probationEndDate}
                  onChange={(e) => handleInputChange('probationEndDate', e.target.value)}
                />
                {getFieldError('probationEndDate') && (
                  <p className=\"text-sm text-destructive\">{getFieldError('probationEndDate')}</p>
                )}
              </div>
            </div>

            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
              <div className=\"space-y-2\">
                <Label htmlFor=\"departmentId\" className=\"flex items-center gap-2\">
                  <Building className=\"h-4 w-4\" />
                  Department *
                </Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) => handleInputChange('departmentId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder=\"Select department\" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDepartments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError('departmentId') && (
                  <p className=\"text-sm text-destructive\">{getFieldError('departmentId')}</p>
                )}
              </div>

              <div className=\"space-y-2\">
                <Label htmlFor=\"roleId\">Role *</Label>
                <Select
                  value={formData.roleId}
                  onValueChange={(value) => handleInputChange('roleId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder=\"Select role\" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError('roleId') && (
                  <p className=\"text-sm text-destructive\">{getFieldError('roleId')}</p>
                )}
              </div>
            </div>

            <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">
              <div className=\"space-y-2\">
                <Label htmlFor=\"supervisorId\">Supervisor</Label>
                <Select
                  value={formData.supervisorId}
                  onValueChange={(value) => handleInputChange('supervisorId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder=\"Select supervisor\" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=\"\">No supervisor</SelectItem>
                    {availableSupervisors.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className=\"space-y-2\">
                <Label htmlFor=\"status\">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=\"active\">Active</SelectItem>
                    <SelectItem value=\"inactive\">Inactive</SelectItem>
                    <SelectItem value=\"on-leave\">On Leave</SelectItem>
                    <SelectItem value=\"terminated\">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className=\"space-y-2\">
                <Label htmlFor=\"contractType\">Contract Type</Label>
                <Select
                  value={formData.contractType}
                  onValueChange={(value) => handleInputChange('contractType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=\"permanent\">Permanent</SelectItem>
                    <SelectItem value=\"contract\">Contract</SelectItem>
                    <SelectItem value=\"intern\">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
            <CardDescription>
              Contact information for emergencies
            </CardDescription>
          </CardHeader>
          <CardContent className=\"space-y-4\">
            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
              <div className=\"space-y-2\">
                <Label htmlFor=\"emergencyContactName\">Name *</Label>
                <Input
                  id=\"emergencyContactName\"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                  placeholder=\"Enter emergency contact name\"
                />
                {getFieldError('emergencyContact.name') && (
                  <p className=\"text-sm text-destructive\">{getFieldError('emergencyContact.name')}</p>
                )}
              </div>

              <div className=\"space-y-2\">
                <Label htmlFor=\"emergencyContactRelationship\">Relationship *</Label>
                <Input
                  id=\"emergencyContactRelationship\"
                  value={formData.emergencyContact.relationship}
                  onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                  placeholder=\"e.g., Spouse, Parent, Sibling\"
                />
                {getFieldError('emergencyContact.relationship') && (
                  <p className=\"text-sm text-destructive\">{getFieldError('emergencyContact.relationship')}</p>
                )}
              </div>
            </div>

            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
              <div className=\"space-y-2\">
                <Label htmlFor=\"emergencyContactPhone\">Phone *</Label>
                <Input
                  id=\"emergencyContactPhone\"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                  placeholder=\"Enter emergency contact phone\"
                />
                {getFieldError('emergencyContact.phone') && (
                  <p className=\"text-sm text-destructive\">{getFieldError('emergencyContact.phone')}</p>
                )}
              </div>

              <div className=\"space-y-2\">
                <Label htmlFor=\"emergencyContactEmail\">Email</Label>
                <Input
                  id=\"emergencyContactEmail\"
                  type=\"email\"
                  value={formData.emergencyContact.email || ''}
                  onChange={(e) => handleInputChange('emergencyContact.email', e.target.value)}
                  placeholder=\"Enter emergency contact email (optional)\"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className=\"flex items-center justify-end gap-4\">
          <Button
            type=\"button\"
            variant=\"outline\"
            onClick={() => navigate('/employees')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type=\"submit\" disabled={isSubmitting}>
            {isSubmitting ? (
              <>Loading...</>
            ) : (
              <>
                <Save className=\"h-4 w-4 mr-2\" />
                {isEditing ? 'Update Employee' : 'Add Employee'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

