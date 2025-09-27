import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4} from 'uuid';

export async function POST(req: NextRequest) {
    try {
        // fetching loan id
        const {loanId} = await req.json();

        // handling basic errors
        if (!loanId) {
            return NextResponse.json(
                { error: 'LoanId is required' },
                { status: 400 }
            );
        }

        // generating token id (UUID)
        const tokenId = uuidv4();

        // supabase init
        const supabase = await createClient();

        // updating database
        const { data, error } = await supabase
            .from('loans')
            .update({
                tokenized: true,
                token_id: tokenId
            }) 
            .eq('id', loanId)
            .select('*')
            .single();

        if (error) throw error;
        
        return NextResponse.json({ success: true, loan: data });
    } catch (err:any) {
        return NextResponse.json(
            { error: err.message || 'Tokenization error'},
            { status: 500}
        );
    }
}