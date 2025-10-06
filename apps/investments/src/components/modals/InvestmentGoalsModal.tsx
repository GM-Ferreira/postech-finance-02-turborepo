"use client";

import { useState, useEffect } from "react";

import { Modal, Button, Input } from "@repo/ui";

interface InvestmentGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoals: {
    fixedIncomeGoal: number;
    variableIncomeGoal: number;
  };
  onSave: (goals: {
    fixedIncomeGoal: number;
    variableIncomeGoal: number;
  }) => void;
}

export const InvestmentGoalsModal = ({
  isOpen,
  onClose,
  currentGoals,
  onSave,
}: InvestmentGoalsModalProps) => {
  const [fixedGoal, setFixedGoal] = useState("");
  const [variableGoal, setVariableGoal] = useState("");

  const formatInitialValue = (value: number) => {
    return `R$ ${value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  useEffect(() => {
    if (isOpen) {
      setFixedGoal(formatInitialValue(currentGoals.fixedIncomeGoal));
      setVariableGoal(formatInitialValue(currentGoals.variableIncomeGoal));
    }
  }, [isOpen, currentGoals]);

  const handleSave = () => {
    const fixedIncomeGoal =
      parseFloat(fixedGoal.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
    const variableIncomeGoal =
      parseFloat(variableGoal.replace(/[^\d,]/g, "").replace(",", ".")) || 0;

    onSave({
      fixedIncomeGoal,
      variableIncomeGoal,
    });
    onClose();
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, "");
    const formattedValue = (parseFloat(numericValue) / 100).toLocaleString(
      "pt-BR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
    return `R$ ${formattedValue}`;
  };

  const handleFixedGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    setFixedGoal(formatCurrency(value));
  };

  const handleVariableGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    setVariableGoal(formatCurrency(value));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Configurar Metas de Investimento
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta para Renda Fixa
            </label>
            <Input
              type="text"
              value={fixedGoal}
              onChange={handleFixedGoalChange}
              placeholder="R$ 0,00"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Inclui: Tesouro Direto, Previdência Privada, CDB, etc.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta para Renda Variável
            </label>
            <Input
              type="text"
              value={variableGoal}
              onChange={handleVariableGoalChange}
              placeholder="R$ 0,00"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Inclui: Ações, Fundos de Investimento, ETFs, etc.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={onClose}
            className="flex-1 bg-gray-500 hover:bg-gray-600"
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Salvar Metas
          </Button>
        </div>
      </div>
    </Modal>
  );
};
