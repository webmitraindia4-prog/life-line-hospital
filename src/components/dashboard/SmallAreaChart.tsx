import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Point = { name: string; value: number };

type Props = {
  data: Point[];
  color?: string; // hex color for stroke / gradient base
  height?: number;
  title?: string;
};

export default function SmallAreaChart({
  data,
  color = "#6366F1",
  height = 120,
  title,
}: Props) {
  const gradientId = `grad-${color.replace(/[#\W]/g, "")}`;

  return (
    <div>
      {title && <div className="mb-2 text-sm font-semibold text-gray-600">{title}</div>}

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 6, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.85} />
                <stop offset="100%" stopColor={color} stopOpacity={0.12} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.04)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={`url(#${gradientId})`}
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
