'use client';

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle, Shield, Truck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gray-50">
        <div className="absolute inset-y-0 w-full h-full" aria-hidden="true">
          <div className="relative h-full">
            <svg
              className="absolute right-full transform translate-y-1/3 translate-x-1/4 md:translate-y-1/2 sm:translate-x-1/2 lg:translate-x-full"
              width="404"
              height="784"
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="e229dbec-10e9-49ee-8ec3-0286ca089edf"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="784" fill="url(#e229dbec-10e9-49ee-8ec3-0286ca089edf)" />
            </svg>
          </div>
        </div>
        <div className="relative pt-6 pb-16 sm:pb-24">
          <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6 lg:mt-32">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <h1>
                  <span className="block text-sm font-semibold uppercase tracking-wide text-indigo-600 sm:text-base lg:text-sm xl:text-base">
                    Next-Gen Management
                  </span>
                  <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                    <span className="block text-gray-900">Advanced Warehouse</span>
                    <span className="block text-indigo-600">Solutions</span>
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  Streamline your inventory, manage blocks and rooms with ease, and optimize your supply chain with our state-of-the-art warehouse management system.
                </p>
                <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                  {user ? (
                    <Link href="/dashboard">
                      <Button size="lg" className="w-full sm:w-auto">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/register">
                        <Button size="lg" className="w-full sm:w-auto">
                          Get Started
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                      <Link href="/login">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                          Log In
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                  <div className="relative block w-full bg-white rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <div className="p-8 bg-indigo-600 flex items-center justify-center">
                      <Truck className="h-48 w-48 text-white/90" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage space
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Shield className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Secure Access</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Role-based access control ensuring only authorized personnel can manage critical warehouse data.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <CheckCircle className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Smart Storage</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Efficiently organize, allocate, and track storage blocks and rooms to maximize capacity.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

    </div>
  );
}
