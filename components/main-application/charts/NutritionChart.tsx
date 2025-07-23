"use client";
import React from "react";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  SectorProps,
} from "recharts";

type Coordinate = {
  x: number;
  y: number;
};
type PieSectorData = {
  percent?: number;
  name?: string | number;
  midAngle?: number;
  middleRadius?: number;
  tooltipPosition?: Coordinate;
  value?: number;
  paddingAngle?: number;
  dataKey?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  label?: string;
};
type PieSectorDataItem = React.SVGProps<SVGPathElement> &
  Partial<SectorProps> &
  PieSectorData;

const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}: PieSectorDataItem) => {
  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={-10}
        textAnchor="middle"
        fill={fill}
        fontSize={12}
        fontWeight={600}
      >
        {payload.name}
        <tspan x={cx} dy={18}>
          {((percent ?? 0) * 100).toFixed(2)}%
        </tspan>
        <tspan x={cx} dy={18}>
          {value} g
        </tspan>
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill="none"
        stroke={fill}
        strokeWidth={1}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(innerRadius ?? 0) - 7}
        outerRadius={(innerRadius ?? 0) - 6}
        fill={fill}
      />
    </g>
  );
};

const NutritionChart = ({ nutritionData }: { nutritionData: ChartData[] }) => {
  const activeNutritionData = nutritionData.filter((item) => item.value > 0);

  if (
    nutritionData.reduce((acc, item) => acc + item.value, 0) === 0 &&
    MealBasedValues.reduce((acc, item) => acc + item.value, 0) === 0
  ) {
    return (
      <div className="flex items-center justify-center h-full aspect-square bg-gradient-to-br from-accent via-primary to-accent rounded-full text-center p-6">
        <div className="space-y-2">
          <div className="text-4xl">🥣</div>
          <p className="text-lg font-bold text-background">
            Nothing on your plate yet!
          </p>
          <p className="text-sm text-background">
            Log a meal to see your nutrition chart light up ✨
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ResponsiveContainer
        width="100%"
        height="100%"
        className="pointer-events-none"
        style={{ border: "none", boxShadow: "none", outline: "none" }}
      >
        <PieChart width={200} height={200}>
          <Pie
            activeShape={renderActiveShape}
            data={activeNutritionData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="none"
            stroke="none"
            paddingAngle={5}
            dataKey="value"
            className="pointer-events-auto"
          />
          {/* <Pie
            data={activeMealBasedValues}
            cx="50%"
            cy="50%"
            innerRadius={85}
            outerRadius={100}
            fill="none"
            paddingAngle={2}
            stroke="fill"
            dataKey="value"
            pointerEvents="none"
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              name,
              value,
              payload,
            }) => {
              // Calculate label position closer to center
              const RADIAN = Math.PI / 180;
              const radius = innerRadius + (outerRadius - innerRadius) * 3.5;
              const safeMidAngle = midAngle ?? 0;
              const x = cx + radius * Math.cos(-safeMidAngle * RADIAN);
              const y = cy + radius * Math.sin(-safeMidAngle * RADIAN);
              return (
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="insideStart"
                  fontSize={12}
                  fontWeight={700}
                  fill={payload.fill || "#000"}
                >
                  {name}
                  <tspan x={x} dy={16}>
                    {value} kcal
                  </tspan>
                </text>
              );
            }}
            labelLine={false}
          /> */}
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default NutritionChart;

// Placeholder for the NutritionChart component
// This component will eventually render a pie chart showing the distribution of macronutrients
// such as carbohydrates, proteins, and fats in a user's diet.
// const NutritionData = [
//   { name: "Protein", value: 10, fill: "#2c2cda" },
//   { name: "CHO", value: 0, fill: "#00B4D8" },
//   { name: "Fat", value: 38, fill: "#FFA600" },
//   { name: "Sat. Fats", value: 0, fill: "#ff6F51" },
//   { name: "Fiber", value: 0, fill: "#2ECC71" },
//   { name: "Sugar", value: 0, fill: "#F72585" },
// ];
// const activeNutritionData = NutritionData.filter((item) => item.value > 0);

const MealBasedValues = [
  { name: "Breakfast", value: 240, fill: "rgba(174, 214, 241, 0.9)" },
  { name: "Lunch", value: 0, fill: "rgba(129, 199, 132, 0.9)" },
  { name: "Dinner", value: 0, fill: "rgba(255, 138, 128, 0.9)" },
  { name: "Snacks", value: 0, fill: "rgba(179, 157, 219, 0.9)" },
  { name: "Dessert", value: 0, fill: "rgba(255, 205, 210, 0.9)" },
];
const activeMealBasedValues = MealBasedValues.filter((item) => item.value > 0);
