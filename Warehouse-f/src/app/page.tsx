'use client';

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle, Shield, Truck, Package, Zap, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/15 to-indigo-400/15 rounded-full blur-3xl animate-pulse-subtle"></div>
        </div>

        <div className="relative pt-6 pb-16 sm:pb-24">
          <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6 lg:mt-32">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left animate-slide-up">
                <h1>
                  <span className="block text-sm font-black uppercase tracking-widest text-primary sm:text-base lg:text-sm xl:text-base mb-4">
                    Next-Gen Management
                  </span>
                  <span className="mt-1 block text-5xl tracking-tight font-black sm:text-6xl xl:text-7xl">
                    <span className="block text-gray-900 dark:text-white">Advanced Warehouse</span>
                    <span className="block text-gradient-primary mt-2">Solutions</span>
                  </span>
                </h1>
                <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 sm:mt-8 sm:text-xl lg:text-lg xl:text-xl font-medium leading-relaxed">
                  Streamline your inventory, manage blocks and rooms with ease, and optimize your supply chain with our state-of-the-art warehouse management system.
                </p>
                <div className="mt-10 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                  {user ? (
                    <Link href="/dashboard">
                      <Button size="lg" className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105 group">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/register">
                        <Button size="lg" className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105 group">
                          Get Started
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <Link href="/login">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-primary font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105">
                          Log In
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center animate-scale-in">
                <div className="relative mx-auto w-full rounded-3xl shadow-2xl lg:max-w-md">
                  <div className="relative block w-full bg-gradient-primary rounded-3xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary group">
                    <div className="p-12 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                      <Truck className="h-48 w-48 text-white/90 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse-subtle"></div>
                      <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center animate-slide-up">
            <h2 className="text-base text-primary font-black tracking-widest uppercase">Features</h2>
            <p className="mt-4 text-4xl leading-tight font-black tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Everything you need to manage space
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 lg:mx-auto font-medium">
              Powerful tools designed for modern warehouse operations
            </p>
          </div>

          <div className="mt-16">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
              {[
                {
                  name: 'Secure Access',
                  description: 'Role-based access control ensuring only authorized personnel can manage critical warehouse data.',
                  icon: Shield,
                  gradient: 'from-emerald-500 to-teal-600'
                },
                {
                  name: 'Smart Storage',
                  description: 'Efficiently organize, allocate, and track storage blocks and rooms to maximize capacity.',
                  icon: Package,
                  gradient: 'from-indigo-500 to-purple-600'
                },
                {
                  name: 'Real-time Tracking',
                  description: 'Monitor inventory levels and shipments in real-time with advanced tracking capabilities.',
                  icon: Zap,
                  gradient: 'from-amber-500 to-orange-600'
                },
                {
                  name: 'Optimized Logistics',
                  description: 'Streamline your supply chain with intelligent routing and automated workflows.',
                  icon: Truck,
                  gradient: 'from-blue-500 to-cyan-600'
                },
                {
                  name: 'Performance Analytics',
                  description: 'Gain insights with comprehensive analytics and reporting tools for data-driven decisions.',
                  icon: TrendingUp,
                  gradient: 'from-rose-500 to-pink-600'
                },
                {
                  name: 'Quality Assurance',
                  description: 'Maintain high standards with built-in quality checks and validation processes.',
                  icon: CheckCircle,
                  gradient: 'from-violet-500 to-purple-600'
                }
              ].map((feature, index) => (
                <div
                  key={feature.name}
                  className="relative group animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="glass-card p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full border-2 border-transparent hover:border-primary/20">
                    <dt>
                      <div className={`flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <feature.icon className="h-8 w-8" aria-hidden="true" />
                      </div>
                      <p className="mt-6 text-xl leading-6 font-black text-gray-900 dark:text-white">{feature.name}</p>
                    </dt>
                    <dd className="mt-3 text-base text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                      {feature.description}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-90"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black text-white sm:text-5xl mb-6">
            Ready to transform your warehouse?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium">
            Join thousands of businesses optimizing their operations with our platform
          </p>
          {!user && (
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-bold py-4 px-10 rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
