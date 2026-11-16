"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, EmptyState, buttonClasses } from "@/components/ui";
import { getDepositWeight } from "@/features/nasabah/deposit-card";
import { formatDate, formatRupiah, formatWeight } from "@/features/nasabah/format";
import { PrototypeNotice } from "@/features/nasabah/prototype-notice";
import { usePrototype } from "@/features/nasabah/prototype-store";

export default function SaldoPage() {
  const { deposits } = usePrototype();

  const completedDeposits = deposits
    .filter((deposit) => deposit.status === "selesai")
    .sort(
      (left, right) => new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime(),
    );
  const totalSaldo = completedDeposits.reduce(
    (total, deposit) => total + (deposit.finalTotal ?? 0),
    0,
  );
  const totalWeight = completedDeposits.reduce(
    (total, deposit) => total + getDepositWeight(deposit),
    0,
  );

  return (
    <div className="flex flex-col gap-5">
      <PrototypeNotice />

      <header className="flex flex-col gap-1">
        <h1 className="text-h2 text-foreground">Saldo setoran</h1>
        <p className="text-body text-muted">
          Akumulasi nilai dari transaksi yang sudah dikonfirmasi petugas.
        </p>
      </header>

      <Card className="border-primary/40 bg-primary-soft">
        <CardHeader>
          <p className="text-body-sm text-muted">Total nilai setoran selesai</p>
          <p className="text-display text-foreground">{formatRupiah(totalSaldo)}</p>
          <p className="text-body-sm text-muted">
            Catatan nilai setoran, bukan dana yang bisa ditarik.
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-surface p-3">
            <p className="text-caption text-muted">Transaksi selesai</p>
            <p className="text-h4 text-foreground">{completedDeposits.length}</p>
          </div>
          <div className="rounded-lg bg-surface p-3">
            <p className="text-caption text-muted">Total berat aktual</p>
            <p className="text-h4 text-foreground">{formatWeight(totalWeight)}</p>
          </div>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="text-h3 text-foreground">Rincian transaksi selesai</h2>
        {completedDeposits.length > 0 ? (
          completedDeposits.map((deposit) => (
            <Link
              key={deposit.id}
              href={`/nasabah/setoran/${deposit.id}`}
              className="block rounded-xl border border-border bg-surface p-5 shadow-sm transition-colors hover:border-accent/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-body font-semibold text-foreground">{deposit.code}</p>
                  <p className="text-body-sm text-muted">
                    {formatDate(deposit.submittedAt)} · {deposit.unitName}
                  </p>
                  <p className="text-body-sm text-muted">
                    {deposit.items.length} jenis · {formatWeight(getDepositWeight(deposit))}
                  </p>
                </div>
                <p className="text-body font-semibold text-foreground">
                  {formatRupiah(deposit.finalTotal ?? 0)}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <EmptyState
            title="Belum ada transaksi selesai"
            description="Nilai setoran akan muncul setelah petugas mengonfirmasi transaksi."
            action={
              <Link href="/nasabah/setor" className={buttonClasses({ size: "sm" })}>
                Mulai setor
              </Link>
            }
          />
        )}
      </section>

      <p className="text-caption text-muted">
        Saldo adalah catatan nilai setoran, bukan uang tunai atau dana yang dapat ditarik. Data pada
        halaman ini adalah simulasi.
      </p>
    </div>
  );
}
