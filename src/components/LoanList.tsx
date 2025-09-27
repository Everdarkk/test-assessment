"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/utils/supabase/client";
import { Loan } from "@/utils/types";


export default function LoanList({ profileId }: {profileId: string}) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fetching loans for the given profileId
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
        setError(err.message || "Upload error");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [profileId]);

  // tokenization handler
  const handleTokenize = async (loanId: string) => {
    try {
      const res = await fetch("/api/tokenize-loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loanId }),
      });

      if (!res.ok) throw new Error("Tokenization failed");
      const data = await res.json();

      // local state update
      setLoans((prev) =>
        prev.map((loan) =>
          loan.id === loanId ? { ...loan, ...data.loan } : loan
        )
      );
    } catch (err: any) {
      alert(err.message || "Tokenization error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (loans.length === 0) return <p>No loan records.</p>;

  return (
    <div>
        {loans.map((loan) => (
            <div key={loan.id}>
                <p><strong>ID:</strong> {loan.id}</p>
                <p><strong>Status:</strong> {loan.status}</p>
                <p><strong>Total amount:</strong> {loan.amount}</p>
                <p><strong>Payment schedule:</strong> {loan.payment_schedule}</p>
                <p><strong>Interest rate %:</strong> {loan.interest_rate}</p>
                <p><strong>LTV:</strong> {loan.ltv}</p>
                <p><strong>Risk group:</strong> {loan.risk_group}</p>
                <p><strong>Agreement link:</strong>{" "}
                    {loan.agreement_url ? (
                        <a href={loan.agreement_url} target="_blank" rel="noreferrer">
                        View Agreement
                        </a>
                    ) : (
                            "-"
                        )   
                    }
                </p>
                <p><strong>Due date:</strong> {loan.due_date ? new Date(loan.due_date).toLocaleDateString() : "-"}</p>
                <p><strong>Tokenized:</strong> {loan.tokenized ? "Yes" : "No"}</p>

                {(!loan.tokenized && loan.status === 'active') ? (
                  <button onClick={() => handleTokenize(loan.id)}>
                    Tokenize
                  </button>
                ): (
                  <button disabled={true}>
                    Tokenize
                  </button>
                )}
            </div>
        ))}
    </div>
  );
}
