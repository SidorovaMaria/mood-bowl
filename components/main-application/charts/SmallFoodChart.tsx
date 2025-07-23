"use client";
import React from "react";
import { Pie, PieChart } from "recharts";

const SmallFoodChart = ({
  data = [],
  totalKcal = 0,
  fill = "#fff",
  stroke = false,
}: {
  data: ChartData[];
  totalKcal: number;
  fill?: string;
  stroke?: boolean;
}) => {
  return (
    <PieChart width={100} height={100} className="pointer-events-none">
      <Pie
        data={data}
        dataKey="value"
        cx="50%"
        cy="50%"
        innerRadius={35}
        outerRadius={45}
        paddingAngle={10}
        stroke={stroke ? "#fff" : "none"}
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
        fill={fill}
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
