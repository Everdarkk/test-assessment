import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import UploadCsv from '@/components/UploadCsv';
import LoanList from '@/components/LoanList';
import Chart from '@/components/Chart';

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
    <>
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
          <p>
            Product type: {profile.product_type}
          </p>
          <p>
            Credit risk score: {profile.credit_risk_score}
          </p>

          {profile.contacts &&
            <p>
              {profile.contacts}
            </p>
          }

          {profile.website_url &&
            <a href={profile.website_url} target="_blank" rel="noopener noreferrer">
              {profile.website_url}
            </a>
          }
      
        </div>
      </div>

      <div>
        <UploadCsv profileId={profileId} />
      </div>

      <div>
        <LoanList profileId={profileId}/>
      </div>

      <Chart profileId={profileId}/>
    </>
  );
}