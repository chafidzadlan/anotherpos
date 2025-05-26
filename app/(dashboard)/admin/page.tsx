"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, BarChart3, Settings, Users } from "lucide-react";

const adminCards = [
  {
    title: "User Management",
    description: "Manage all system users and their roles.",
    href: "/admin/users",
    icon: Users,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "System Settings",
    description: "Configure system-wide settings",
    href: "/admin/settings",
    icon: Settings,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Reports & analytics",
    description: "View system reports and analytics.",
    href: "/admin/reports",
    icon: BarChart3,
    color: "from-purple-500 to-purple-600",
  }
];

export default function AdminDashboard() {
  const { data: session } = useSession();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-600">
          Welcome back, <span className="font-medium">{session?.user?.name}</span>!
          You have full administrative access.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group relative bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 group-hover:text-slate-900">{card.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{card.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  );
}