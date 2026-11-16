import { LogoutButton } from "@/features/auth/logout-button";
import { ComingSoon } from "@/features/petugas/coming-soon";

export default function ProfilPage() {
  return (
    <>
      <ComingSoon title="Profil" />
      <div className="mx-auto w-full max-w-[720px] px-5 pt-4">
        <LogoutButton variant="profile" />
      </div>
    </>
  );
}
