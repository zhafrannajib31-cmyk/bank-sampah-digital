import { LogoutButton } from "@/features/auth/logout-button";

export default function PetugasHomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-12">
      <h1 className="text-2xl font-semibold">Beranda Petugas</h1>
      <p className="text-zinc-600">Halaman petugas (placeholder).</p>
      <div>
        <LogoutButton />
      </div>
    </main>
  );
}
