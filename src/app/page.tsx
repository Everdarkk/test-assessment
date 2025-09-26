import Link from "next/link";
import ProfileList from "@/components/ProfileList";

export default function Home() {
  return (
    <div>
      <ProfileList />

      <Link href="/create">Create Profile</Link>
    </div>
  );
}
