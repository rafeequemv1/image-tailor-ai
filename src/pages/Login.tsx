
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";
import { LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/app");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.session) {
        toast({
          title: "Login Successful",
          description: "You have been logged in.",
        });
        navigate("/app");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-grow items-center justify-center w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Login</h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email and password to sign in
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full flex justify-center items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
          
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-black hover:underline">
                Sign Up
              </Link>
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
