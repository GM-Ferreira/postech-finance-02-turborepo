"use client";

import { SharedNavigation } from "@repo/ui";

import InvestmentsHeader from "@/components/layout/Header";
import { InvestmentChart } from "@/components/charts/InvestmentChart";

export default function InvestmentsPage() {
  return (
    <div className="min-h-screen">
      <InvestmentsHeader />

      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
            <SharedNavigation />

            <main className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Meus Investimentos
              </h1>
              <InvestmentChart />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
