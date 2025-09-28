import Link from "next/link";
import ProfileList from "@/components/ProfileList";
import styles from '../styles/profilespage.module.css';
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className={styles.container}>
      <Link href="/create" className={styles.create}>
        <Image 
          src="/images/createicon.png" 
          alt="Create new profile" 
          width={50} 
          height={50} 
          className={styles.image}
        />
      </Link>
      
      <ProfileList />

    </div>
  );
}
