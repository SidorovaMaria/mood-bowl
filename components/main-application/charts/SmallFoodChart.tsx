import React from "react";
import { Pie, PieChart } from "recharts";
type ChartData = { name: string; value: number; fill: string };
const SmallFoodChart = ({
  data = [],
  totalKcal = 0,
}: {
  data: ChartData[];
  totalKcal: number;
}) => {
  return (
    <PieChart width={100} height={100}>
      <Pie
        data={data}
        dataKey="value"
        cx="50%"
        cy="50%"
        innerRadius={35}
        outerRadius={45}
        paddingAngle={10}
        fill="#8884d8"
      />
      <text
        x={50}
        y={50}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={16}
        dy="-0.5em"
        fontWeight={600}
        fill="#fff"
      >
        {totalKcal}
        <tspan x={50} dy="1.5em" fontSize={12}>
          kcal
        </tspan>
      </text>
    </PieChart>
  );
};

export default SmallFoodChart;
