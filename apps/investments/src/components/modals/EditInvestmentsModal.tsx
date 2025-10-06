"use client";

import { useState, useEffect } from "react";

import { Modal, Button, Input } from "@repo/ui";

import { InvestmentItem } from "@/data/investmentMockData";

interface EditInvestmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  investments: InvestmentItem[];
  onSave: (investments: InvestmentItem[]) => void;
}

export const EditInvestmentsModal = ({
  isOpen,
  onClose,
  investments,
  onSave,
}: EditInvestmentsModalProps) => {
  const [values, setValues] = useState<{ [key: string]: string }>({});

  const formatInitialValue = (value: number) => {
    return `R$ ${value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  useEffect(() => {
    if (isOpen) {
      const initialValues: { [key: string]: string } = {};
      investments.forEach((investment) => {
        initialValues[investment.id] = formatInitialValue(investment.value);
      });
      setValues(initialValues);
    }
  }, [isOpen, investments]);

  const handleSave = () => {
    const updatedInvestments = investments.map((investment) => {
      const rawValue = values[investment.id];
      if (!rawValue) return investment;

      const numericValue = parseFloat(
        rawValue.replace(/[^\d,]/g, "").replace(",", ".")
      );
      return {
        ...investment,
        value: isNaN(numericValue) ? investment.value : numericValue,
      };
    });

    onSave(updatedInvestments);
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

  const handleValueChange = (investmentId: string, newValue: string) => {
    const value = newValue.replace(/[^\d]/g, "");
    setValues((prev) => ({
      ...prev,
      [investmentId]: formatCurrency(value),
    }));
  };

  const getTypeLabel = (type: string) => {
    return type === "fixed" ? "Renda Fixa" : "Renda Variável";
  };

  const getTypeColor = (type: string) => {
    return type === "fixed" ? "text-blue-600" : "text-orange-600";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Editar Valores dos Investimentos
        </h2>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {investments.map((investment) => (
            <div
              key={investment.id}
              className="border border-gray-200 p-4 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {investment.name}
                  </h3>
                  <span className={`text-sm ${getTypeColor(investment.type)}`}>
                    {getTypeLabel(investment.type)}
                  </span>
                </div>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: investment.color }}
                />
              </div>

              <Input
                type="text"
                value={values[investment.id] || ""}
                onChange={(e) =>
                  handleValueChange(investment.id, e.target.value)
                }
                placeholder="R$ 0,00"
                className="w-full mt-2"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={onClose}
            className="flex-1 bg-gray-500 hover:bg-gray-600"
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Salvar Alterações
          </Button>
        </div>
      </div>
    </Modal>
  );
};
