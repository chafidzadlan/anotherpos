"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Home, Shield } from "lucide-react";

export default function Unauthorized() {
  const { data: session } = useSession();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (session?.user?.role) {
            const routes = {
              admin: "/admin",
              manager: "/manager",
              cashier: "/cashier",
              inventory: "/inventory",
            };
            router.push(routes[session.user.role as keyof typeof routes] || "/dashboard")
          } else {
            router.push("/login");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, session]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/80 backdrop-blur-lg">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div className="mb-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">403</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          </div>
          <div className="mb-8">
            <p className="text-gray-600 mb-4 leading-relaxed">
              You don&apos;t have the necessary permissions to access this resource.
              Please contact your administrator if you believe this is an error.
            </p>
            {session?.user && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Current Role:</span> {session.user.role || "Unknown"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">User:</span> {session.user.name || session.user.email}
                </p>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <Button
              onClick={() => router.back()}
              className="w-full h-11 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
            </Button>
            <div className="flex gap-2">
              <Link href={session?.user?.role ? `/${session.user.role}` : "/dashboard"} className="flex-1">
                <Button variant="outline" className="w-full h-11 border-gray-200 hover:bg-gray-50">
                  <Home className="h-4 w-4 mr-2" /> Dashboard
                </Button>
              </Link>
              <Link href="/contact" className="flex-1">
                <Button variant="outline" className="w-full h-11 border-gray-200 hover:bg-gray-50">Get Help</Button>
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Auto-redirecting in {countdown} seconds</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}