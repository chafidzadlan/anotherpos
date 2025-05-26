"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session } = useSession();

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">Welcome, {session?.user?.name}! You have admin access.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
            <p className="text-gray-600 mb-4">Manage all system users and their roles.</p>
            <Link href="/admin/users" className="text-indigo-600 hover:text-indigo-500">Manager Users →</Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
            <p className="text-gray-600 mb-4">Configure system-wide settings.</p>
            <Link href="/admin/settings" className="text-indigo-600 hover:text-indigo-500">Settings →</Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Reports</h3>
            <p className="text-gray-600 mb-4">View system reports and analytics.</p>
            <Link href="/admin/reports" className="text-indigo-600 hover:text-indigo-500">View Reports →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}