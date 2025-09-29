"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/utils/supabase/client";
import { Loan } from "../utils/types";
import styles from '../styles/loanlist.module.css'


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
      } catch (err) {
        console.log(err);
        setError('Error fetching loans.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [profileId]);

  // status checker
  const getStatus = (due_date: string | null) => {
    if (!due_date) return "Active";
    return new Date(due_date) < new Date() ? "Expired" : "Active";
  };

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
    } catch (err) {
      alert(err || "Tokenization error");
    }
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.errorSign} style={{ color: "red" }}>{error}</p>;
  if (loans.length === 0) return <p className={styles.noLoan}>No loan records.</p>;

  return (
    <div className={styles.container}>
        {loans.map((loan) => (
            <div key={loan.id} className={styles.cardWrap}>
                <p className={styles.id}><strong>{loan.id}</strong></p>
                <p className={styles.status}><strong>Status:</strong> {getStatus(loan.due_date)} </p>
                <p className={styles.amount}><strong>Total amount:</strong> {loan.amount}</p>
                <p className={styles.payment}><strong>Payment schedule:</strong> {loan.payment_schedule}</p>
                <p className={styles.interest}><strong>Interest rate %:</strong> {loan.interest_rate}</p>
                <p className={styles.ltv}><strong>LTV:</strong> {loan.ltv}</p>
                <p className={styles.riskGroup}><strong>Risk group:</strong> {loan.risk_group}</p>
                <p className={styles.agreement}><strong>Agreement link:</strong>{" "}
                    {loan.agreement_url ? (
                        <a href={loan.agreement_url} target="_blank" rel="noreferrer">
                        View Agreement
                        </a>
                    ) : (
                            "-"
                        )   
                    }
                </p>
                <p className={styles.data}><strong>Due date:</strong> {loan.due_date ? new Date(loan.due_date).toLocaleDateString() : "-"}</p>
                <p className={styles.tokenized}><strong>Tokenized:</strong> {loan.tokenized ? "Yes" : "No"}</p>

                {(!loan.tokenized && getStatus(loan.due_date) === 'Active') ? (
                  <button className={styles.button} onClick={() => handleTokenize(loan.id)}>
                    Tokenize
                  </button>
                ): (
                  <button className={styles.button} disabled={true}>
                    Tokenize
                  </button>
                )}
            </div>
        ))}
    </div>
  );
}
