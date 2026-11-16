"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Asset, ErrorState, StepActions, StepHeader } from "@/components/ui";
import { CategoryTile, CheckBadge } from "@/features/nasabah/category-tile";
import { StepScreen } from "@/features/nasabah/step-screen";
import { rejectDeposit, usePetugasDeposits } from "@/features/petugas/store";
import { cn } from "@/lib/cn";

const reasons = [
  {
    id: "jenis",
    title: "Jenis tidak sesuai",
    text: "Jenis sampah tidak sama dengan pengajuan",
    tile: "plastik",
  },
  {
    id: "kondisi",
    title: "Kondisi buruk",
    text: "Basah, kotor, atau berbau menyengat",
    tile: "kertas",
  },
  { id: "b3", title: "Mengandung B3", text: "Tercampur limbah berbahaya", tile: "kertas" },
  { id: "penuh", title: "Unit penuh", text: "Kapasitas Unit tidak mencukupi", tile: "logam" },
  {
    id: "data",
    title: "Data tidak valid",
    text: "Identitas atau data tidak cocok",
    tile: "botol-kaca",
  },
  { id: "lainnya", title: "Lainnya", text: "Tulis alasan singkat lainnya", tile: "elektronik" },
] as const;

const MIN_NOTE = 10;

export default function TolakPengajuanPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const deposit = usePetugasDeposits().find((candidate) => candidate.id === id);
  const [reasonId, setReasonId] = useState<string>("jenis");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const backHref = `/petugas/pengajuan/${id}`;

  if (!deposit || deposit.status !== "menunggu") {
    return (
      <StepScreen>
        <StepHeader title="Tolak Pengajuan" subtitle={deposit?.code} backHref="/petugas/antrean" />
        <ErrorState
          title="Pengajuan tidak bisa ditolak"
          description="Hanya pengajuan berstatus Menunggu yang dapat ditolak."
        />
        <Link href="/petugas/antrean" className="text-[14px] font-semibold text-blue-dark">
          Kembali ke antrean
        </Link>
      </StepScreen>
    );
  }

  const reason = reasons.find((item) => item.id === reasonId) ?? reasons[0];

  function submit() {
    if (!deposit) return;
    const text = reason.id === "lainnya" ? note.trim() : reason.title;
    if (reason.id === "lainnya" && text.length < MIN_NOTE) {
      setError(`Tulis alasan minimal ${MIN_NOTE} karakter.`);
      return;
    }
    rejectDeposit(deposit.id, reason.id === "lainnya" ? text : `${reason.title}: ${reason.text}`);
    router.replace("/petugas/antrean");
  }

  return (
    <StepScreen>
      <StepHeader
        title="Tolak Pengajuan"
        subtitle={`${deposit.code} · ${deposit.customerName}`}
        backHref={backHref}
      />
      <p className="text-[12px] leading-[17px] font-medium text-black/80">
        Pilih alasan penolakan. Alasan wajib dan tercatat.
      </p>

      <ul className="grid grid-cols-2 gap-x-[10px] gap-y-[9px]">
        {reasons.map((item, index) => {
          const selected = item.id === reasonId;
          return (
            <li key={item.id} className="flex">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setReasonId(item.id);
                  setError(null);
                }}
                className={cn(
                  "relative flex min-h-[148px] w-full flex-col gap-[11px] rounded-[20px] border-solid px-3 pt-[14px] pb-[14px] text-left focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                  selected
                    ? "border-[1.5px] border-primary bg-green-light px-[14px]"
                    : "border-[0.5px] border-black/50 bg-white",
                )}
              >
                <CategoryTile id={item.tile} />
                {selected ? (
                  <span className="absolute top-[14px] right-3">
                    <CheckBadge />
                  </span>
                ) : null}
                <span className="flex flex-col gap-1 tracking-[-0.275px]">
                  <span className="text-[14px] leading-[16.5px] font-medium text-black">
                    {item.title}
                  </span>
                  <span
                    className={cn(
                      "text-[12px] leading-[16.5px] font-medium",
                      item.id === "lainnya"
                        ? "font-semibold text-blue-dark"
                        : selected
                          ? "text-green-dark-active"
                          : "text-black",
                    )}
                  >
                    {item.id === "lainnya" ? "Isi catatan" : `Alasan ${index + 1}`}
                  </span>
                  <span className="text-[12px] leading-[17px] text-black/80">{item.text}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {reason.id === "lainnya" ? (
        <div className="flex flex-col gap-1">
          <label htmlFor="catatan" className="text-[12px] font-semibold text-heading">
            Catatan alasan (minimal {MIN_NOTE} karakter)
          </label>
          <textarea
            id="catatan"
            value={note}
            onChange={(event) => {
              setNote(event.target.value);
              setError(null);
            }}
            rows={3}
            aria-invalid={error ? true : undefined}
            className="w-full rounded-[10px] border-[0.5px] border-black/30 bg-white p-3 text-[13px] text-heading focus:ring-2 focus:ring-accent/40 focus:outline-none"
          />
          {error ? (
            <p role="alert" className="text-[12px] font-medium text-danger">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-center gap-[10px] rounded-[10px] border-[0.5px] border-black/20 bg-white px-[18px] py-[12px]">
        <Asset src="/nasabah/icon-info.svg" width={18.5} height={18.5} />
        <p className="text-[12px] leading-[17px] font-light text-black/70">
          Penolakan mengubah status menjadi Dibatalkan dan tercatat di audit.
        </p>
      </div>

      <StepActions>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[12px] leading-[17px] text-black/70">Alasan: {reason.title}</p>
          <p className="shrink-0 font-sans text-[12px] font-semibold text-green-dark-active">
            Wajib diisi
          </p>
        </div>
        <button
          type="button"
          onClick={submit}
          className="flex h-[50px] w-full items-center justify-center gap-1 rounded-[10px] bg-danger font-sans text-[14px] font-bold text-white transition-colors hover:bg-danger-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Tolak Pengajuan
          <Asset src="/onboarding/icon-arrow-white.svg" width={13.3333} height={13.3333} />
        </button>
      </StepActions>
    </StepScreen>
  );
}
