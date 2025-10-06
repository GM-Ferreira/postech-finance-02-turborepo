"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import "@/styles/charts.css";

interface InvestmentGoalsChartProps {
  fixedIncome: number;
  variableIncome: number;
  fixedIncomeGoal: number;
  variableIncomeGoal: number;
}

export const InvestmentGoalsChart = ({
  fixedIncome,
  variableIncome,
  fixedIncomeGoal,
  variableIncomeGoal,
}: InvestmentGoalsChartProps) => {
  const data = [
    {
      name: "Renda Fixa",
      atual: fixedIncome,
      meta: fixedIncomeGoal,
      progress: (fixedIncome / fixedIncomeGoal) * 100,
    },
    {
      name: "Renda Variável",
      atual: variableIncome,
      meta: variableIncomeGoal,
      progress: (variableIncome / variableIncomeGoal) * 100,
    },
  ];

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; name: string; dataKey: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const atualValue = payload.find((p) => p.dataKey === "atual")?.value || 0;
      const metaValue = payload.find((p) => p.dataKey === "meta")?.value || 0;

      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{`${label}`}</p>
          <p className="text-primary">
            {`Atual: R$ ${atualValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          </p>
          <p className="text-gray-600">
            {`Meta: R$ ${metaValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          </p>
          <p className="text-sm text-gray-500">
            {`Progresso: ${metaValue > 0 ? ((atualValue / metaValue) * 100).toFixed(1) : 0}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
        <XAxis
          dataKey="name"
          tick={{ fill: "white", fontSize: 12 }}
          axisLine={{ stroke: "white" }}
        />
        <YAxis
          tick={{ fill: "white", fontSize: 10 }}
          axisLine={{ stroke: "white" }}
          tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip content={<CustomTooltip />} />

        <Bar
          dataKey="meta"
          fill="#ffffff20"
          name="Meta"
          radius={[4, 4, 4, 4]}
          fillOpacity={0.6}
        />

        <Bar
          dataKey="atual"
          name="Atual"
          radius={[4, 4, 4, 4]}
          fillOpacity={0.9}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.progress >= 100
                  ? "#10B981"
                  : entry.progress >= 75
                    ? "#F59E0B"
                    : "#EF4444"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
