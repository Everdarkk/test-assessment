import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export default async function ProfileDashboard({ 
  params,
}: { 
  params: { id: string } 
}) {
    // get profile ID from params
    const profileId = params.id;

    // supabase init
    const supabase = createClient();

    // individual profile fetch
    const { data: profile, error } = await (await supabase)
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

    // error handling <not found>
    if (error || !profile) {
        notFound(); 
    }

  return (
    <div>
      <h1>
        Dashboard: {profile.name}
      </h1>
      
      <div>
        <h2>
            Details
        </h2>

        <p>
            Country: {profile.country}
        </p>

        <p>
            Founding year: {profile.founding_year}
        </p>

        <p>
            Total portfolio: {profile.total_portfolio.toLocaleString('uk-UA')} EUR
        </p>
        
      </div>
    </div>
  );
}