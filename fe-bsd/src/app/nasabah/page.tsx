"use client";

import Link from "next/link";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  EmptyState,
  buttonClasses,
} from "@/components/ui";
import { DepositCard, getDepositWeight } from "@/features/nasabah/deposit-card";
import { formatRupiah, formatWeight } from "@/features/nasabah/format";
import { PrototypeNotice } from "@/features/nasabah/prototype-notice";
import { usePrototype } from "@/features/nasabah/prototype-store";

export default function NasabahHomePage() {
  const { deposits, profile } = usePrototype();

  const sortedDeposits = [...deposits].sort(
    (left, right) => new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime(),
  );
  const activeDeposit = sortedDeposits.find(
    (deposit) => deposit.status === "menunggu" || deposit.status === "diproses",
  );
  const completedDeposits = deposits.filter((deposit) => deposit.status === "selesai");
  const totalSaldo = completedDeposits.reduce(
    (total, deposit) => total + (deposit.finalTotal ?? 0),
    0,
  );
  const totalWeight = completedDeposits.reduce(
    (total, deposit) => total + getDepositWeight(deposit),
    0,
  );
  const firstName = profile.name.split(" ")[0] ?? profile.name;

  return (
    <div className="flex flex-col gap-6">
      <PrototypeNotice />

      <section className="flex flex-col gap-1">
        <p className="text-body-sm text-muted">Halo, {firstName}</p>
        <h1 className="text-h1 text-foreground">Mau setor sampah hari ini?</h1>
        <p className="text-body text-muted">
          Antar sampah ke unit, petugas menimbang, lalu nilai final dihitung dari berat aktual.
        </p>
      </section>

      <Card className="border-primary/40 bg-primary-soft">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <CardDescription>Nilai setoran tercatat</CardDescription>
              <p className="text-display text-foreground">{formatRupiah(totalSaldo)}</p>
            </div>
            <Badge variant="success">Selesai</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-body-sm text-muted">
            Catatan nilai setoran, bukan dana yang bisa ditarik.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-body-sm text-muted">
            <span>{completedDeposits.length} transaksi selesai</span>
            <span aria-hidden>·</span>
            <span>{formatWeight(totalWeight)} berat aktual</span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/nasabah/setor"
              className={buttonClasses({ size: "lg", className: "w-full sm:w-auto" })}
            >
              Mulai setor sampah
            </Link>
            <Link
              href="/nasabah/saldo"
              className={buttonClasses({
                variant: "outline",
                size: "lg",
                className: "w-full sm:w-auto",
              })}
            >
              Lihat saldo
            </Link>
          </div>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-h3 text-foreground">Pengajuan aktif</h2>
          <Link href="/nasabah/riwayat" className="text-body-sm font-semibold text-accent">
            Lihat riwayat
          </Link>
        </div>
        {activeDeposit ? (
          <DepositCard deposit={activeDeposit} />
        ) : (
          <EmptyState
            title="Tidak ada pengajuan aktif"
            description="Ajukan setoran baru dan pantau statusnya di sini."
            action={
              <Link href="/nasabah/setor" className={buttonClasses({ size: "sm" })}>
                Ajukan setoran
              </Link>
            }
          />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-h3 text-foreground">Riwayat terbaru</h2>
          <Link href="/nasabah/riwayat" className="text-body-sm font-semibold text-accent">
            Semua
          </Link>
        </div>
        {sortedDeposits.length > 0 ? (
          <div className="flex flex-col gap-3">
            {sortedDeposits.slice(0, 3).map((deposit) => (
              <DepositCard key={deposit.id} deposit={deposit} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Belum ada setoran"
            description="Setoran yang Anda ajukan akan muncul di sini."
          />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-h3 text-foreground">Cara setor</h2>
        <Card>
          <div className="flex flex-col gap-4 p-5">
            <Step
              number="1"
              title="Pilih unit dan jenis sampah"
              description="Tentukan unit tujuan serta estimasi berat sampah Anda."
            />
            <Step
              number="2"
              title="Antar sampah ke unit"
              description="Tunjukkan kode pengajuan ke petugas saat tiba."
            />
            <Step
              number="3"
              title="Petugas menimbang dan mengonfirmasi"
              description="Nilai final muncul setelah berat aktual dikonfirmasi."
            />
          </div>
        </Card>
      </section>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-body-sm font-bold text-green-darker">
        {number}
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-body font-semibold text-foreground">{title}</p>
        <p className="text-body-sm text-muted">{description}</p>
      </div>
    </div>
  );
}
