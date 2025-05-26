"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Store, ShoppingCart, BarChart3, Users, Package, CreditCard, ArrowRight, Shield, Loader2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: ShoppingCart,
    title: "Point of Sale",
    description: "Fast and intuitive checkout process with barcode scanning and receipt printing.",
    color: "bg-blue-500"
  },
  {
    icon: Package,
    title: "Inventory Management",
    description: "Track stock levels, manage suppliers, and automate reorder processes.",
    color: "bg-green-500"
  },
  {
    icon: BarChart3,
    title: "Sales Analytics",
    description: "Comprehensive reporting and analytics to track performance and trends.",
    color: "bg-purple-500"
  },
  {
    icon: Users,
    title: "Staff Management",
    description: "Role-based access control and employee performance tracking.",
    color: "bg-orange-500"
  },
  {
    icon: CreditCard,
    title: "Payment Processing",
    description: "Accept multiple payment methods including cash, cards, and digital wallets.",
    color: "bg-pink-500"
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Secure data handling with audit trails and compliance reporting.",
    color: "bg-indigo-500"
  }
];

const stats = [
  { label: "Active Users", value: "2,500+", trend: "+12%" },
  { label: "Daily Transactions", value: "15,000+", trend: "+8%" },
  { label: "Inventory Items", value: "50,000+", trend: "+15%" },
  { label: "Revenue Processed", value: "$2.5M+", trend: "+22%" }
];


export default function Home() {
  const { data: session, status } = useSession();;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    setIsLoading(true);

    if (session?.user?.role) {
      const routes = {
        admin: "/admin",
        manager: "/manager",
        cashier: "/cashier",
        inventory: "/inventory",
      };
      router.push(routes[session.user.role as keyof typeof routes] || "/dashboard");
    } else {
      router.push("/login");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000" />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl mb-6">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Modern POS System
              <span className="block text-blue-200">for Your Business</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Streamline your supermarket with our comprehensive point-of-sale solution.
              Manage inventory, process payments, and track analytics all in one place.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleGetStarted}
              disabled={isLoading}
              className="h-12 px-8 bg-white text-blue-600 hover:bg-blue-50 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  {session ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
            {!session && (
              <Link href="/login">
                <Button variant="outline" className="h-12 px-8 border-white/30 text-white hover:bg-white/10 font-semibold text-lg">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
       <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 mb-1">{stat.label}</div>
                <div className="flex items-center justify-center text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your Store
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive POS system provides all the tools you need to manage your supermarket efficiently.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust our POS system to streamline their operations and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              disabled={isLoading}
              className="h-12 px-8 bg-white text-blue-600 hover:bg-blue-50 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
                </>
              ) : (
                <>
                  {session ? "Access Dashboard" : "Start Free Trial"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
            <Link href="/contact">
              <Button variant="outline" className="h-12 px-8 border-white/30 text-blue-600 hover:bg-white/10 font-semibold text-lg">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <footer className="py-12 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Store className="w-6 h-6 text-blue-400 mr-2" />
                <span className="text-white font-semibold text-lg">POS System</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Modern point-of-sale solution design for supermarkets and retail businesses.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/training" className="hover:text-white transition-colors">Training</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">System Status</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/news" className="hover:text-white transition-colors">News</Link></li>
                <li><Link href="/partners" className="hover:text-white transition-colors">Partners</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 sm:mb-0">
              © 2025 POS System. All rights reserved.
            </p>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
