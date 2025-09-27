import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Profile } from "@/utils/types";

export default async function ProfileList() {
    // supabase init
    const supabase = createClient();
    console.log(supabase);
    // fetch profiles
    const { data: profiles, error } = await (await supabase)
        .from('profiles')
        .select('*')
        .order('id', { ascending: true });
    
    // error handling
    if (error) {
        return (
            <p>Error loading profiles: {error.message}</p>
        )
    }

    // no profiles case
    if (!profiles || profiles.length === 0) {
        return (
            <p>No profiles found...</p>
        )
    }

    // render list of profiles
    return (
        <ul>
            {profiles.map((profile: Profile) => (
                <li key={profile.id}>
                    <Link href={`/dashboard/${profile.id}`}>
                        <h2>{profile.name}</h2>
                        
                        {profile.founding_year &&
                            <p>Established in {profile.founding_year}</p>
                        }

                        <p>From {profile.country}</p>

                        <p>Total portfolio: {profile.total_portfolio}</p>

                        <p>Credit risk: {profile.credit_risk_score}</p>
                        
                        <p>Product type: {profile.product_type}</p>

                        
                    </Link>
                </li>
            ))}
        </ul>
    )
}