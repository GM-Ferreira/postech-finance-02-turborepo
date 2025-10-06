export interface InvestmentItem extends Record<string, unknown> {
  id: string;
  name: string;
  value: number;
  color: string;
  type: "fixed" | "variable";
}

export const investmentMockData: InvestmentItem[] = [
  {
    id: "1",
    name: "Fundos de investimento",
    value: 15000,
    color: "#0088FE",
    type: "variable",
  },
  {
    id: "2",
    name: "Tesouro Direto",
    value: 10000,
    color: "#8884d8",
    type: "fixed",
  },
  {
    id: "3",
    name: "Previdência Privada",
    value: 8000,
    color: "#FF8042",
    type: "fixed",
  },
  {
    id: "4",
    name: "Bolsa de Valores",
    value: 17000,
    color: "#FFBB28",
    type: "variable",
  },
];

export interface InvestmentGoals {
  fixedIncomeGoal: number;
  variableIncomeGoal: number;
}

export const defaultInvestmentGoals: InvestmentGoals = {
  fixedIncomeGoal: 25000,
  variableIncomeGoal: 35000,
};

export const getInvestmentSummary = () => {
  const fixedIncome = investmentMockData
    .filter((item) => item.type === "fixed")
    .reduce((sum, item) => sum + item.value, 0);

  const variableIncome = investmentMockData
    .filter((item) => item.type === "variable")
    .reduce((sum, item) => sum + item.value, 0);

  const total = fixedIncome + variableIncome;

  return {
    fixedIncome,
    variableIncome,
    total,
  };
};

export const getInvestmentProgress = (goals: InvestmentGoals) => {
  const summary = getInvestmentSummary();

  return {
    fixedIncomeProgress: (summary.fixedIncome / goals.fixedIncomeGoal) * 100,
    variableIncomeProgress:
      (summary.variableIncome / goals.variableIncomeGoal) * 100,
    totalGoal: goals.fixedIncomeGoal + goals.variableIncomeGoal,
    totalProgress:
      (summary.total / (goals.fixedIncomeGoal + goals.variableIncomeGoal)) *
      100,
  };
};

export const simulateUpdate = (): InvestmentItem[] => {
  return investmentMockData.map((item) => {
    let variation: number;

    if (item.type === "fixed") {
      variation = (Math.random() - 0.3) * 0.07;
    } else {
      variation = (Math.random() - 0.45) * 0.35;
    }

    const newValue = Math.max(1000, Math.round(item.value * (1 + variation)));

    return {
      ...item,
      value: newValue,
    };
  });
};

export const updateInvestmentData = (newData: InvestmentItem[]): void => {
  investmentMockData.splice(0, investmentMockData.length, ...newData);
};
