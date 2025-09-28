import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import UploadCsv from '@/components/UploadCsv';
import LoanList from '@/components/LoanList';
import Chart from '@/components/Chart';
import styles from '../../../styles/dashboardpage.module.css'

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
    <div className={styles.container}>
      <div className={styles.summaryCard}>
        <h1 className={styles.companyName}>
            {profile.name} Dashboard
        </h1>
    
        <div className={styles.keyMetrics}>
            <div className={styles.metricItem}>
                <p className={styles.metricLabel}>Total Portfolio (EUR)</p>
                <p className={styles.metricValue}>
                    {profile.total_portfolio.toLocaleString('uk-UA')}
                </p>
            </div>
            <div className={styles.metricItem}>
                <p className={styles.metricLabel}>Credit Risk Score</p>
                <p className={styles.metricValue}>
                    {profile.credit_risk_score}
                </p>
            </div>
        </div>

        <div className={styles.detailsSection}>
            <h2 className={styles.detailsTitle}>
                General Details
            </h2>
        
            <div className={styles.detailsGrid}>
                <p className={styles.detailItem}>
                    <span className={styles.detailLabel}>Country:</span> {profile.country}
                </p>
                <p className={styles.detailItem}>
                    <span className={styles.detailLabel}>Product Type:</span> {profile.product_type}
                </p>
                <p className={styles.detailItem}>
                    <span className={styles.detailLabel}>Founded:</span> {profile.founding_year}
                </p>
            
                {profile.website_url &&
                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className={styles.websiteUrl}>
                    Website
                    </a>
                }
                {profile.contacts &&
                  <p className={styles.detailItem}>
                    <span className={styles.detailLabel}>Contacts:</span> {profile.contacts}
                  </p>
                }
            </div>
        </div>
    </div>
      <UploadCsv profileId={profileId} />

      <LoanList profileId={profileId}/>

      <div className={styles.chartWrap}>
        <Chart profileId={profileId}/>
      </div>
    </div>
  );
}