"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/utils/supabase/client";
import { Loan } from "@/utils/types";

interface LoanListProps {
  profileId: string;
}

export default function LoanList({ profileId }: LoanListProps) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileId) return;

    const fetchLoans = async () => {
      setLoading(true);
      setError(null);

      try {
        
        const { data, error } = await supabaseClient
          .from("loans")
          .select("*")
          .eq("profile_id", profileId)
          .order("due_date", { ascending: true });

        if (error) throw error;

        setLoans(data);
      } catch (err: any) {
        setError(err.message || "Помилка при завантаженні займів");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [profileId]);

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (loans.length === 0) return <p>Немає записів про займи.</p>;

  return (
    <div>
        {loans.map((loan) => (
            <div key={loan.id} className="loan-card">
                <p><strong>ID:</strong> {loan.id}</p>
                <p><strong>Статус:</strong> {loan.status}</p>
                <p><strong>Сума:</strong> {loan.amount}</p>
                <p><strong>Графік платежів:</strong> {loan.payment_schedule}</p>
                <p><strong>Ставка %:</strong> {loan.interest_rate}</p>
                <p><strong>LTV:</strong> {loan.ltv}</p>
                <p><strong>Група ризику:</strong> {loan.risk_group}</p>
                <p><strong>Договір:</strong>{" "}
                    {loan.agreement_url ? (
                        <a href={loan.agreement_url} target="_blank" rel="noreferrer">
                        Переглянути
                        </a>
                    ) : (
                            "-"
                        )   
                    }
                </p>
                <p><strong>Термін:</strong> {loan.due_date ? new Date(loan.due_date).toLocaleDateString() : "-"}</p>
                <p><strong>Токенізовано:</strong> {loan.tokenized ? "Так" : "Ні"}</p>
            </div>
        ))}
    </div>
  );
}
