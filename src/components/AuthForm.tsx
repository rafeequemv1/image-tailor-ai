
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { EyeIcon, EyeOffIcon, LogInIcon, UserPlusIcon } from "lucide-react";

interface AuthFormProps {
  onDemoLogin: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onDemoLogin }) => {
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, just show a toast indicating we need Supabase connection
    toast({
      title: "Authentication Pending",
      description: "Please connect your app to Supabase to enable authentication features.",
    });
  };
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <Button 
                type="button"
                variant="ghost" 
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            {isLogin ? (
              <>
                <LogInIcon className="mr-2 h-4 w-4" />
                Sign in
              </>
            ) : (
              <>
                <UserPlusIcon className="mr-2 h-4 w-4" />
                Sign up
              </>
            )}
          </Button>
          
          <div className="text-center">
            <Button 
              type="button" 
              variant="link" 
              className="text-sm"
              onClick={toggleAuthMode}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={onDemoLogin}
          >
            Demo Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
