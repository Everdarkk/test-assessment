"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from "recharts";
import { LoanStats } from "@/utils/types";


export default function LoanStatsColumns({ profileId }: { profileId: string }) {
  const [stats, setStats] = useState<LoanStats | null>(null);

  useEffect(() => {
    if (!profileId) return;
    async function fetchStats() {
      const res = await fetch(`/api/loan-stats?profileId=${profileId}`);
      const data = await res.json();
      setStats(data);
    }
    fetchStats();
  }, [profileId]);

  if (!stats) return <p>Завантаження...</p>;

  const data = [
    { name: "Total Loans", value: stats.total_loans },
    { name: "Tokenised", value: stats.tokenised },
    { name: "Remaining", value: stats.remaining },
    { name: "On Time", value: stats.on_time },
    { name: "Overdue", value: stats.overdue },
    { name: "Completed", value: stats.completed },
  ];

  const COLORS = [
    "#4E79A7", // Total Loans 
    "#F28E2B", // Tokenised 
    "#E15759", // Remaining 
    "#76B7B2", // On Time 
    "#59A14F", // Overdue 
    "#EDC948", // Completed 
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
      <BarChart
        width={700}
        height={400}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
        <XAxis dataKey="name" tick={{ fill: "#ccc", fontSize: 14 }} />
        <YAxis tick={{ fill: "#ccc", fontSize: 14 }} />
        <Tooltip
          formatter={(value: number) => `${value} EUR`}
          contentStyle={{ backgroundColor: "#706f6fff", borderRadius: 8, borderColor: "#ccc" }}
        />
        <Bar dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
}
