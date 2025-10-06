"use client";

import { SharedNavigation } from "@repo/ui";

import InvestmentsHeader from "@/components/layout/Header";
import { InvestmentChart } from "@/components/charts/InvestmentChart";
import { getInvestmentSummary } from "@/data/investmentMockData";

export default function InvestmentsPage() {
  const { fixedIncome, variableIncome, total } = getInvestmentSummary();

  return (
    <div className="min-h-screen">
      <InvestmentsHeader />

      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
            <SharedNavigation />

            <main className="space-y-6">
              <div className="bg-zinc-300 p-6 rounded-lg flex-1 min-h-[478px]">
                <h1 className="text-3xl font-bold text-black mb-4">
                  Investimentos
                </h1>

                <p className="text-2xl font-semibold text-primary mb-6">
                  Total: R${" "}
                  {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-primary text-white p-6 rounded-lg text-center">
                    <h3 className="text-lg font-medium mb-2">Renda Fixa</h3>
                    <p className="text-2xl font-bold">
                      R${" "}
                      {fixedIncome.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  <div className="bg-primary text-white p-6 rounded-lg text-center">
                    <h3 className="text-lg font-medium mb-2">Renda Variável</h3>
                    <p className="text-2xl font-bold">
                      R${" "}
                      {variableIncome.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h2 className="text-xl font-bold text-black mb-4">
                    Estatísticas
                  </h2>

                  <div className="bg-primary p-6 rounded-lg">
                    <InvestmentChart />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
