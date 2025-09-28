import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Profile } from "../utils/types";
import styles from '../styles/profilelist.module.css'

export default async function ProfileList() {
    // supabase init
    const supabase = await createClient();

    // fetch profiles
    const { data: profiles, error } = await supabase
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
        <ul className={styles.container}>
            {profiles.map((profile: Profile) => (
                <li key={profile.id} className={styles.cardWrap}>
                    <Link href={`/dashboard/${profile.id}`} className={styles.card}>
                        <h2 className={styles.name}>{profile.name}</h2>
                        
                        {profile.founding_year &&
                            <p className={styles.year}>Established in {profile.founding_year}</p>
                        }

                        <p className={styles.country}>From {profile.country}</p>

                        <p className={styles.portfolio}>Total portfolio: <strong>{(profile.total_portfolio).toLocaleString('uk-UA')} EUR</strong></p>

                        <p className={styles.risk}>Credit risk: {profile.credit_risk_score}</p>
                        
                        <p className={styles.type}>Product type: {profile.product_type}</p>

                        
                    </Link>
                </li>
            ))}
        </ul>
    )
}