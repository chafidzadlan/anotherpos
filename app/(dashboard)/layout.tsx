"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, User } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PS</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">POS Supermarket</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors cursor-pointer">
                  <User className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">
                    {session.user.name}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium capitalize">
                    {session.user.role}
                  </span>
                </div>
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/login" })} className="text-slate-600 hover:text-slate-800 hover:bg-slate-100">
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}