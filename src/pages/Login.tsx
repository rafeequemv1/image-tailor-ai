
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";

const Login = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto flex-grow flex items-center justify-center py-12">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your email and password to sign in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Authentication requires Supabase integration
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/app">Continue to App Without Login</Link>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground text-center w-full">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">Sign Up</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
