"use client";
import { useState, useEffect } from "react";

import { SharedNavigation, Button } from "@repo/ui";

import InvestmentsHeader from "@/components/layout/Header";
import { InvestmentChart } from "@/components/charts/InvestmentChart";
import { InvestmentGoalsChart } from "@/components/charts/InvestmentGoalsChart";
import { InvestmentGoalsModal } from "@/components/modals/InvestmentGoalsModal";
import { EditInvestmentsModal } from "@/components/modals/EditInvestmentsModal";
import {
  getInvestmentSummary,
  investmentMockData,
  defaultInvestmentGoals,
  getInvestmentProgress,
  InvestmentGoals,
  InvestmentItem,
  simulateUpdate,
  updateInvestmentData,
} from "@/data/investmentMockData";

export default function InvestmentsPage() {
  const [goals, setGoals] = useState<InvestmentGoals>(defaultInvestmentGoals);
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [investments, setInvestments] =
    useState<InvestmentItem[]>(investmentMockData);
  const [updateKey, setUpdateKey] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const { fixedIncome, variableIncome, total } = getInvestmentSummary();
  const progress = getInvestmentProgress(goals);

  const handleEditInvestments = (updatedInvestments: InvestmentItem[]) => {
    updateInvestmentData(updatedInvestments);
    setInvestments(updatedInvestments);
    setUpdateKey((prev) => prev + 1);
  };

  const handleMarketUpdate = async () => {
    setIsUpdating(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const newData = simulateUpdate();

    updateInvestmentData(newData);
    setInvestments(newData);
    setUpdateKey((prev) => prev + 1);
    setIsUpdating(false);
  };

  useEffect(() => {
    const savedGoals = localStorage.getItem("investmentGoals");
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);
        setGoals(parsedGoals);
      } catch (error) {
        console.error("Erro ao carregar metas do localStorage:", error);
      }
    }
  }, []);

  const handleSaveGoals = (newGoals: InvestmentGoals) => {
    setGoals(newGoals);
    localStorage.setItem("investmentGoals", JSON.stringify(newGoals));
  };

  return (
    <div className="min-h-screen">
      <InvestmentsHeader />

      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
            <SharedNavigation />

            <main className="space-y-6">
              <div className="bg-zinc-300 p-6 rounded-lg flex-1 min-h-[478px]">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-3xl font-bold text-black">
                    Investimentos
                  </h1>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsEditModalOpen(true)}
                      className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700"
                      title="Editar valores dos investimentos"
                    >
                      Editar Investimentos
                    </Button>
                    <Button
                      onClick={handleMarketUpdate}
                      className="text-sm px-4 py-2 bg-success hover:bg-success/90"
                      title="Simular atualização do mercado"
                      isLoading={isUpdating}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Gerando..." : "Gerar aleatórios"}
                    </Button>
                  </div>
                </div>

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

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-black">
                      Metas de Investimento
                    </h2>
                    <Button
                      onClick={() => setIsGoalsModalOpen(true)}
                      className="text-sm px-4 py-2"
                    >
                      Editar Metas
                    </Button>
                  </div>

                  <div className="bg-primary p-6 rounded-lg">
                    <div className="mb-4">
                      <div className="flex justify-between text-white text-sm mb-2">
                        <span>
                          Progresso Total: {progress.totalProgress.toFixed(1)}%
                        </span>
                        <span>
                          Meta Total: R${" "}
                          {progress.totalGoal.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-white h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(progress.totalProgress, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <InvestmentGoalsChart
                      key={`goals-${updateKey}`}
                      fixedIncome={fixedIncome}
                      variableIncome={variableIncome}
                      fixedIncomeGoal={goals.fixedIncomeGoal}
                      variableIncomeGoal={goals.variableIncomeGoal}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <h2 className="text-xl font-bold text-black mb-4">
                    Distribuição por Categoria
                  </h2>

                  <div className="bg-primary p-6 rounded-lg">
                    <InvestmentChart
                      key={`chart-${updateKey}`}
                      investments={investments}
                    />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      <InvestmentGoalsModal
        isOpen={isGoalsModalOpen}
        onClose={() => setIsGoalsModalOpen(false)}
        currentGoals={goals}
        onSave={handleSaveGoals}
      />

      <EditInvestmentsModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        investments={investments}
        onSave={handleEditInvestments}
      />
    </div>
  );
}
