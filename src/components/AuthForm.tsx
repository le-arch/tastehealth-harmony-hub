
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

interface AuthFormProps {
  onAuthenticated: (user: any) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthenticated }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    firstName: '', lastName: '', username: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.info('Database features have been removed');
    setIsLoading(false);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.info('Database features have been removed');
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-lg border-none shadow-lg">
      <Tabs defaultValue="login" value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
        <CardHeader>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <CardTitle className="mb-2">Welcome back</CardTitle>
            <CardDescription>Login to your TasteHealth account</CardDescription>
          </TabsContent>
          <TabsContent value="register">
            <CardTitle className="mb-2">Create an account</CardTitle>
            <CardDescription>Join TasteHealth to start your health journey</CardDescription>
          </TabsContent>
        </CardHeader>
        <CardContent>
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" name="email" type="email" placeholder="you@example.com" value={loginData.email} onChange={handleLoginChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input id="login-password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={loginData.password} onChange={handleLoginChange} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {showPassword ? <EyeOffIcon className="h-4 w-4 text-gray-500" /> : <EyeIcon className="h-4 w-4 text-gray-500" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Logging in..." : "Login"}</Button>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" name="firstName" placeholder="John" value={registerData.firstName} onChange={handleRegisterChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" name="lastName" placeholder="Doe" value={registerData.lastName} onChange={handleRegisterChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" value={registerData.email} onChange={handleRegisterChange} required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Creating account..." : "Create Account"}</Button>
            </form>
          </TabsContent>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          {activeTab === 'login' ? (
            <p className="text-sm text-muted-foreground">Don't have an account? <button type="button" className="text-primary hover:underline" onClick={() => setActiveTab('register')}>Register</button></p>
          ) : (
            <p className="text-sm text-muted-foreground">Already have an account? <button type="button" className="text-primary hover:underline" onClick={() => setActiveTab('login')}>Login</button></p>
          )}
        </CardFooter>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
