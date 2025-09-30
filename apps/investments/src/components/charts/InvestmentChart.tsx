"use client";

import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Fundos de investimento", value: 15000 },
  { name: "Tesouro Direto", value: 10000 },
  { name: "Previdência Privada", value: 8000 },
  { name: "Bolsa de Valores", value: 17000 },
];

const COLORS = ["#0088FE", "#8884d8", "#FF8042", "#FFBB28"];

export const InvestmentChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={90}
          fill="#8884d8"
          paddingAngle={-10}
          dataKey="value"
          cornerRadius={15}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend
          iconType="circle"
          layout="vertical"
          verticalAlign="middle"
          align="right"
          wrapperStyle={{ paddingLeft: "20px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
