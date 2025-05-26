"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, TrendingUp, Users2 } from "lucide-react";

const inventoryCards = [
  {
    title: "Staff Management",
    description: "Manage cashier and inventory staff",
    href: "/manager/staff",
    icon: Users2,
    color: "from-indigo-500 to-indigo-600",
  },
  {
    title: "Sales Reports",
    description: "View sales and inventory reports",
    href: "/manager/reports",
    icon: TrendingUp,
    color: "from-rose-500 to-rose-600",
  }
];

export default function ManagerDashboard() {
  const { data: session } = useSession();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Manager Dashboard</h1>
        <p className="text-slate-600">
          Welcome, <span className="font-medium">{session?.user?.name}</span>!
          Oversee operations and performance.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {inventoryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group relative bg-white rounded-xl shadow-sm border border-slate-200 p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 group-hover:text-slate-900">{card.title}</h3>
                  <p className="text-slate-600 mt-2">{card.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300 mx-auto" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}