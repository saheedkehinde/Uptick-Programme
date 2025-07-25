import React, { useState, createContext, useContext, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  LogIn, 
  LogOut, 
  User, 
  Shield, 
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export type UserRole = 'admin' | 'viewer';

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
  fullName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<string, { password: string; user: AuthUser }> = {
  'admin': {
    password: 'admin123',
    user: {
      id: 'user_1',
      username: 'admin',
      role: 'admin',
      fullName: 'System Administrator'
    }
  },
  'viewer': {
    password: 'viewer123',
    user: {
      id: 'user_2',
      username: 'viewer',
      role: 'viewer',
      fullName: 'HR Viewer'
    }
  },
  'hr.manager': {
    password: 'hr123',
    user: {
      id: 'user_3',
      username: 'hr.manager',
      role: 'admin',
      fullName: 'HR Manager'
    }
  }
};

// Permission system
const permissions: Record<UserRole, string[]> = {
  admin: [
    'employee.create',
    'employee.read',
    'employee.update',
    'employee.delete',
    'employee.export',
    'dashboard.view',
    'settings.manage'
  ],
  viewer: [
    'employee.read',
    'dashboard.view'
  ]
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Check for stored auth on initialization
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUser = mockUsers[username];
    if (mockUser && mockUser.password === password) {
      setUser(mockUser.user);
      localStorage.setItem('auth_user', JSON.stringify(mockUser.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const hasPermission = (action: string): boolean => {
    if (!user) return false;
    return permissions[user.role].includes(action);
  };

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      if (!success) {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'viewer') => {
    if (role === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('viewer');
      setPassword('viewer123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Employee Management System</CardTitle>
          <CardDescription>
            Sign in to access the HR dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Demo Credentials */}
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <div className="space-y-2">
                <p className="font-medium">Demo Credentials:</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fillDemoCredentials('admin')}
                    className="text-xs"
                  >
                    Admin (Full Access)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fillDemoCredentials('viewer')}
                    className="text-xs"
                  >
                    Viewer (Read Only)
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            <p>Built with TypeScript + React + Tailwind CSS</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function UserProfile() {
  const { user, logout, hasPermission } = useAuth();

  if (!user) return null;

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'viewer':
        return <Eye className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'viewer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-medium">{user.fullName}</p>
        <div className="flex items-center gap-2">
          <Badge className={getRoleColor(user.role)}>
            {getRoleIcon(user.role)}
            <span className="ml-1 capitalize">{user.role}</span>
          </Badge>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={logout}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function PermissionGuard({ 
  permission, 
  children, 
  fallback 
}: { 
  permission: string; 
  children: ReactNode; 
  fallback?: ReactNode;
}) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return fallback || (
      <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          You don't have permission to access this feature.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}

export function AuthStatus() {
  const { user, hasPermission } = useAuth();

  if (!user) return null;

  const userPermissions = permissions[user.role];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Authentication Status
        </CardTitle>
        <CardDescription>
          Current user information and permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">User</Label>
            <p className="text-sm text-muted-foreground">{user.fullName}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Role</Label>
            <Badge className={getRoleColor(user.role)}>
              {getRoleIcon(user.role)}
              <span className="ml-1 capitalize">{user.role}</span>
            </Badge>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Permissions</Label>
          <div className="mt-2 space-y-1">
            {userPermissions.map((permission) => (
              <div key={permission} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-muted-foreground">{permission}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  function getRoleIcon(role: UserRole) {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'viewer':
        return <Eye className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  }

  function getRoleColor(role: UserRole) {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'viewer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  }
}

