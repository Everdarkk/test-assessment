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
import { LoanStats } from "../utils/types";


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
    <div>
      { (stats.total_loans === 0) ? null : 
      <BarChart
        width={700}
        height={400}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#293a4d" />
        <XAxis dataKey="name" tick={{ fill: "#293a4d", fontSize: 14 }} />
        <YAxis tick={{ fill: "#293a4d", fontSize: 14 }} />
        <Tooltip
          formatter={(value: number) => `${value} EUR`}
          contentStyle={{ backgroundColor: "#aaa4a4be", borderRadius: 4, borderColor: "#ccc" }}
        />
        <Bar dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart> }
      
    </div>
  );
}
