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
