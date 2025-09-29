import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import * as csv from "csv-parse/sync";
import { LoanCsvRow } from '../../../utils/types';

export async function POST(req: NextRequest,) {
    //profile id fetching
    const formData = await req.formData();
    const profileId = formData.get("profileId") as string;
    
    if (!profileId) {
        return NextResponse.json({ error: "profile_id not found" }, { status: 400 });
    }

    // supabase init
    const supabase = await createClient();

  try {
    // fetching file form
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No .csv file found" }, { status: 400 });
    }

    // reading the content
    const buffer = Buffer.from(await file.arrayBuffer());
    const text = buffer.toString("utf-8");

    // csv parsing
    const records = csv.parse(text, {
      columns: true, // headers are keys
      skip_empty_lines: true,
      trim: true,
    });

    // preparing to supabase insertion
    const dataToInsert = (records as LoanCsvRow[]).map((row) => {
      const dueDate = row.due_date ? new Date(row.due_date) : null;
      const isExpired = dueDate ? dueDate < new Date() : false;

      return {
        profile_id: profileId,
        status: isExpired ? "Expired" : "Active",
        amount: Number(row.amount),
        payment_schedule: row.payment_schedule,
        interest_rate: Number(row.interest_rate),
        ltv: Number(row.ltv),
        risk_group: row.risk_group,
        agreement_url: row.agreement_url,
        due_date: dueDate ? dueDate.toISOString() : null,
        tokenized: false,
        token_id: null,
      };
    });

    // supabase insertion
    const { error } = await supabase
      .from("loans")
      .upsert(dataToInsert, {
        onConflict: `profile_id,status,amount,payment_schedule,interest_rate,ltv,risk_group,agreement_url,due_date`,
        ignoreDuplicates: true,
      });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, inserted: dataToInsert.length });
  } catch (err: unknown) {
        console.error("CSV upload error:", err);

        const message = err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : JSON.stringify(err);

        return NextResponse.json({ error: message }, { status: 500 });
    }
}
