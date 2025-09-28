import ProfileForm from "@/components/ProfileForm";

export default function CreateProfilePage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
            <ProfileForm />
        </div>
    )
}