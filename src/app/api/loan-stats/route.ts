import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
    // supabase init
    const supabase = await createClient();

    // fetching profile id
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");
    
    if (!profileId) return NextResponse.json({ error: "Missing profileId" }, { status: 400 });

    try {
        const { data, error } = await supabase.rpc("get_loan_stats", { p_profile_id: profileId });
        if (error) throw error;

        // additional metrics
        const total_loans = data.total_amount;
        const tokenised = data.tokenised_amount;
        const remaining = total_loans - tokenised;
        const perf = data.performance; // { on_time, overdue, completed }

        return NextResponse.json({
            total_loans,
            tokenised,
            remaining,
            ...perf,
        });
    } catch (err) {
        return NextResponse.json({ error: err}, { status: 500 });
    }
}
