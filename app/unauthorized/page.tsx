"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Unauthorized Access</h2>
        <p className="text-gray-600 mb-8">You don&apos;t have permission to access this resource.</p>
        <Link href="/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}