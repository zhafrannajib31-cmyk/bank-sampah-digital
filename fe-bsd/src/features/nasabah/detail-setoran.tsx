"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ErrorState,
  StatusBadge,
  buttonClasses,
} from "@/components/ui";
import { getDepositWeight } from "./deposit-card";
import { formatDate, formatDateTime, formatRupiah, formatWeight } from "./format";
import { usePrototype } from "./prototype-store";
import type { BankUnit, Deposit } from "./types";

export function DetailSetoran() {
  const params = useParams<{ id: string }>();
  const { deposits, units } = usePrototype();

  const deposit = deposits.find((candidate) => candidate.id === params.id);

  if (!deposit) {
    return (
      <div className="flex flex-col gap-4">
        <ErrorState
          title="Setoran tidak ditemukan"
          description="Data setoran tidak tersedia. Data prototype mungkin sudah direset."
        />
        <Link href="/nasabah/riwayat" className={buttonClasses({ variant: "outline" })}>
          Kembali ke riwayat
        </Link>
      </div>
    );
  }

  const unit = units.find((candidate) => candidate.id === deposit.unitId);
  const totalWeight = getDepositWeight(deposit);

  return (
    <div className="flex flex-col gap-5">
      <Link href="/nasabah/riwayat" className="text-body-sm font-semibold text-accent">
        ← Kembali ke riwayat
      </Link>

      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-h2 text-foreground">{deposit.code}</h1>
          <StatusBadge status={deposit.status} />
        </div>
        <p className="text-body-sm text-muted">
          Diajukan {formatDateTime(deposit.submittedAt)} · {deposit.unitName}
        </p>
      </header>

      {deposit.status === "menunggu" || deposit.status === "diproses" ? (
        <NextStepCard deposit={deposit} unit={unit} />
      ) : null}

      {deposit.status === "dibatalkan" ? (
        <div className="rounded-xl border border-danger/30 bg-danger-soft p-4 text-body-sm text-danger-dark">
          <p className="font-semibold">Pengajuan dibatalkan</p>
          <p className="mt-1">Alasan: {deposit.cancellationReason ?? "Alasan tidak tercatat."}</p>
        </div>
      ) : null}

      {deposit.status === "selesai" ? (
        <FinalValueCard deposit={deposit} totalWeight={totalWeight} />
      ) : (
        <EstimateCard deposit={deposit} totalWeight={totalWeight} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Rincian jenis sampah</CardTitle>
          <CardDescription>
            Harga per kg adalah harga acuan saat pengajuan atau snapshot saat konfirmasi.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border">
          {deposit.items.map((item) => (
            <div key={item.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <p className="text-body font-semibold text-foreground">{item.categoryName}</p>
                <p className="text-body-sm font-semibold text-foreground">
                  {formatRupiah(item.finalValue ?? item.estimatedValue)}
                </p>
              </div>
              <p className="text-body-sm text-muted">
                {item.actualWeight !== undefined
                  ? `Berat aktual ${formatWeight(item.actualWeight)}`
                  : `Estimasi ${formatWeight(item.estimatedWeight)}`}
                {item.unitPriceSnapshot !== undefined
                  ? ` × ${formatRupiah(item.unitPriceSnapshot)}/kg`
                  : ""}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat status</CardTitle>
          <CardDescription>Semua perubahan status tercatat, termasuk pembatalan.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-col gap-4">
            {deposit.events.map((event) => (
              <li key={event.id} className="flex gap-3">
                <span aria-hidden className="mt-1.5 size-2.5 shrink-0 rounded-full bg-accent" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-body-sm font-semibold text-foreground">{event.title}</p>
                  {event.description ? (
                    <p className="text-body-sm text-muted">{event.description}</p>
                  ) : null}
                  <p className="text-caption text-muted">{formatDateTime(event.at)}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <p className="text-caption text-muted">
        Data simulasi. Nilai final pada aplikasi nyata dihitung dan disimpan oleh server.
      </p>
    </div>
  );
}

function NextStepCard({ deposit, unit }: { deposit: Deposit; unit?: BankUnit }) {
  const isWaiting = deposit.status === "menunggu";

  return (
    <Card className="border-blue-light-active bg-blue-light">
      <CardHeader>
        <p className="text-h4 text-blue-darker">
          {isWaiting ? "Antar sampah ke unit" : "Sampah sedang diperiksa"}
        </p>
        <p className="text-body-sm text-blue-darker/80">
          {isWaiting
            ? "Tunjukkan kode pengajuan ini kepada petugas saat tiba di unit."
            : "Petugas sedang memeriksa kondisi dan menimbang sampah Anda."}
        </p>
      </CardHeader>
      {unit ? (
        <CardContent className="flex flex-col gap-1 text-body-sm text-blue-darker/80">
          <p className="font-semibold text-blue-darker">{unit.name}</p>
          <p>{unit.address}</p>
          <p>{unit.hours}</p>
          <p>{unit.phone}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}

function FinalValueCard({ deposit, totalWeight }: { deposit: Deposit; totalWeight: number }) {
  const completedEvent = deposit.events[deposit.events.length - 1];

  return (
    <Card className="border-green-dark/40 bg-green-light">
      <CardHeader>
        <p className="text-body-sm font-semibold text-green-darker">Nilai final</p>
        <p className="text-display text-green-darker">{formatRupiah(deposit.finalTotal ?? 0)}</p>
        <p className="text-body-sm text-green-darker/80">
          Dihitung dari berat aktual × harga saat petugas mengonfirmasi transaksi.
        </p>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-x-4 gap-y-1 text-body-sm text-green-darker/80">
        <span>Total berat aktual: {formatWeight(totalWeight)}</span>
        <span>{deposit.items.length} jenis sampah</span>
        <span>Selesai {formatDate(completedEvent?.at ?? deposit.submittedAt)}</span>
      </CardContent>
    </Card>
  );
}

function EstimateCard({ deposit, totalWeight }: { deposit: Deposit; totalWeight: number }) {
  return (
    <Card className="border-brown-light-active bg-brown-light">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-body-sm font-semibold text-brown-darker">Estimasi nilai</p>
          <Badge variant="warning">Bukan nilai final</Badge>
        </div>
        <p className="text-h1 text-brown-darker">{formatRupiah(deposit.estimatedTotal)}</p>
        <p className="text-body-sm text-brown-darker/80">
          Nilai final akan muncul setelah petugas menimbang berat aktual dan mengonfirmasi
          transaksi.
        </p>
      </CardHeader>
      <CardContent className="text-body-sm text-brown-darker/80">
        Total estimasi berat: {formatWeight(totalWeight)}
      </CardContent>
    </Card>
  );
}
