"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ActivityChartProps {
  data: { day: string; missions: number; candidatures?: number }[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const hasCandidatures = data.some((d) => (d.candidatures ?? 0) > 0);

  return (
    <ResponsiveContainer width="100%" height={110}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            fontSize: "12px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          }}
          labelStyle={{ color: "#475569", fontWeight: 600 }}
        />
        <Bar dataKey="missions" name="Missions" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={20} />
        {hasCandidatures && (
          <Bar dataKey="candidatures" name="Candidatures" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={20} />
        )}
        {hasCandidatures && (
          <Legend
            wrapperStyle={{ fontSize: "10px", paddingTop: "4px" }}
            formatter={(value) => <span style={{ color: "#94a3b8" }}>{value}</span>}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
