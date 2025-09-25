import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // minimal validation
        if (!body.name) return NextResponse.json({error: 'Name required'},{status: 400});
        
        // supabase init
        const supabase = await createClient();

        // сheck for existing profile
        const { data: existingProfile, error: existingError } = await supabase
            .from('profiles')
            .select('name')
            .eq('name', body.name)
            .single();

        if (existingProfile) {
            return NextResponse.json({ error: 'A profile with this name already exists.' }, { status: 409 }); // 409 Conflict
        }

        // handle potential errors during the existence check
        if (existingError && existingError.code !== 'PGRST116') { 
            // PGRST116 means no rows found, which is what we expect
            return NextResponse.json({ error: existingError.message }, { status: 500 });
        }
        
        // insertion object
        const insert = {
            name: body.name,
            country: body.country ?? null,
            founding_year: body.foundingYear ?? null,
            total_portfolio: body.totalPortfolio ?? 0,
            credit_risk_score: body.creditRiskScore ?? null,
            product_type: body.productType ?? null,
            website_url: body.websiteUrl ?? null,
            contacts: body.contacts ?? null
        };

        const { data, error } = await supabase
        .from('profiles')
        .insert([insert])
        .select()
        .single()
        
        // error handling
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        };

        // return 201 if success
        return NextResponse.json({ profile: data }, { status: 201 })
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 })
    }
}