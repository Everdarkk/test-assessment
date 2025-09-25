import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p>LIST OF PROFILES</p>

      <Link href="/create">Create Profile</Link>
    </div>
  );
}
