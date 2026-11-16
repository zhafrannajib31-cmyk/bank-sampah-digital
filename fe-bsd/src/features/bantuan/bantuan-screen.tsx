import { StepHeader } from "@/components/ui";
import { categories } from "@/features/nasabah/mock-data";
import { StepScreen } from "@/features/nasabah/step-screen";

type Role = "nasabah" | "petugas";

// Isi mengikuti aturan bisnis: estimasi vs berat aktual, nilai dihitung server, saldo bukan dana cair.
const faqs: Record<Role, { q: string; a: string }[]> = {
  nasabah: [
    {
      q: "Apakah berat dan nilai yang saya isi sudah final?",
      a: "Belum. Berat dari kamu hanya estimasi. Berat aktual ditimbang petugas, dan nilai final dihitung server dari berat aktual × harga saat konfirmasi.",
    },
    {
      q: "Kapan setoran saya dianggap selesai?",
      a: "Setelah petugas menimbang dan mengonfirmasi transaksi. Statusnya berubah dari Menunggu, Diproses, lalu Selesai.",
    },
    {
      q: "Apakah saldo bisa ditarik?",
      a: "Belum. Saldo adalah catatan nilai setoran, bukan dana yang bisa dicairkan ke rekening atau e-wallet.",
    },
    {
      q: "Kenapa setoran saya dibatalkan?",
      a: "Petugas wajib menulis alasan pembatalan, misalnya sampah tidak sesuai. Alasannya tampil di detail setoran dan di Notifikasi.",
    },
  ],
  petugas: [
    {
      q: "Apa yang harus dicek sebelum menimbang?",
      a: "Periksa jenis dan kondisi sampah sesuai pengajuan. Jika tidak sesuai, tolak atau batalkan dengan alasan yang jelas.",
    },
    {
      q: "Siapa yang menentukan berat dan nilai?",
      a: "Kamu menginput berat aktual. Nilai dihitung server dari berat aktual × harga saat penimbangan; angka di layar hanya tampilan.",
    },
    {
      q: "Bisakah konfirmasi diulang?",
      a: "Tidak. Konfirmasi hanya sekali dan aman saat koneksi putus: gunakan Coba Lagi, transaksi tidak akan tercatat ganda.",
    },
    {
      q: "Bagaimana mengoreksi transaksi yang sudah selesai?",
      a: "Koreksi dan pembatalan wajib disertai alasan dan tercatat. Hubungi admin bila perlu.",
    },
  ],
};

export function BantuanScreen({ role, backHref }: { role: Role; backHref: string }) {
  return (
    <StepScreen>
      <StepHeader title="Bantuan & Cara Memilah" subtitle="Panduan singkat" backHref={backHref} />

      <section aria-labelledby="memilah" className="flex flex-col gap-[10px]">
        <h2 id="memilah" className="text-[15px] leading-[20px] font-bold text-heading">
          Cara Memilah Sampah
        </h2>
        <p className="text-[12px] leading-[17px] text-subtle">
          Pisahkan per jenis, kosongkan dan bersihkan sebelum disetor. Harga per kg adalah data
          contoh (simulasi).
        </p>
        <ul className="flex flex-col overflow-hidden rounded-[18px] border border-line bg-white">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-b-0"
            >
              <span className="flex flex-col gap-[2px]">
                <span className="text-[14px] leading-[18px] font-semibold text-heading">
                  {category.name}
                </span>
                <span className="text-[12px] leading-[17px] text-subtle">{category.note}</span>
              </span>
              <span className="shrink-0 text-[12px] leading-[17px] text-subtle">
                {category.pricePerKg === null ? "Harga ditentukan petugas" : "Harga sesuai unit"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="faq" className="flex flex-col gap-[10px] pb-6">
        <h2 id="faq" className="text-[15px] leading-[20px] font-bold text-heading">
          Pertanyaan Umum
        </h2>
        <dl className="flex flex-col gap-[10px]">
          {faqs[role].map((item) => (
            <div key={item.q} className="rounded-[18px] border border-line bg-white p-4">
              <dt className="text-[14px] leading-[20px] font-semibold text-heading">{item.q}</dt>
              <dd className="mt-1 text-[12px] leading-[18px] text-subtle">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </StepScreen>
  );
}
