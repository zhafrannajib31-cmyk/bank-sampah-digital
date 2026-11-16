import { EmptyState } from "@/components/ui";

/** Penanda layar petugas yang belum dikerjakan (Scan, Riwayat, Profil). */
export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="mx-auto w-full max-w-[720px] px-5 pt-[50px]">
      <h1 className="mb-4 text-[22px] leading-[28px] font-bold text-heading">{title}</h1>
      <EmptyState title="Segera hadir" description="Layar ini sedang dikerjakan." />
    </div>
  );
}
