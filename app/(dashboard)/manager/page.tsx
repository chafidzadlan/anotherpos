"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ManagerDashboard() {
  const { data: session } = useSession();

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Manager Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Welcome, {session?.user.name}! you have manager access.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Staff Management</h3>
            <p className="text-gray-600 mb-4">Manage cashier and inventory staff.</p>
            <Link href="/manager/staff" className="text-indigo-600 hover:text-indigo-500">Manage Staff →</Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sales reports.</h3>
            <p className="text-gray-600 mb-4">View sales and inventory reports.</p>
            <Link href="/manager/reports" className="text-indigo-600 hover:text-indigo-500">View Reports →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}