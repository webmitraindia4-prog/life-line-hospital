import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string; // gradient like "from-indigo-400 to-pink-400"
  tone?: string; // custom tone class like "tone-indigo"
  change?: string;
  positive?: boolean;
  small?: boolean;
};

export default function StatCard({
  title,
  value,
  icon,
  color = "from-blue-600 to-cyan-500",
  tone,
  change,
  positive = true,
  small = true,
}: StatCardProps) {
  const topBar = color ? `h-2 w-full bg-gradient-to-r ${color}` : "";
  const iconClass = tone ? tone : `bg-gradient-to-r ${color}`;

  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition-all duration-300 ${small ? "p-3" : "p-6"}`}>
      {topBar && <div className={topBar} />}

      <div className={small ? "p-2" : "p-6"}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
            <h2 className={`mt-1 font-extrabold text-slate-800 ${small ? "text-xl" : "text-4xl"}`}>{value}</h2>

            {change && (
              <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {change}
              </div>
            )}
          </div>

          <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-white shadow-lg transition ${iconClass}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}