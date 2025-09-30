"use client";

import { SharedNavigation } from "@repo/ui";

import CardsHeader from "@/components/layout/Header";

export default function CardsPage() {
  return (
    <div className="min-h-screen">
      <CardsHeader />

      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
            <SharedNavigation />

            <main className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800">Meus Cartões</h1>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
