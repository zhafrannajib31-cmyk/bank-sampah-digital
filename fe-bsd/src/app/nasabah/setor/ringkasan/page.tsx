"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  LoadingState,
  buttonClasses,
} from "@/components/ui";
import { clearDraft, getDraftSnapshot, parseDraft } from "@/features/nasabah/draft";
import { formatRupiah, formatWeight } from "@/features/nasabah/format";
import { PrototypeNotice } from "@/features/nasabah/prototype-notice";
import { calculateEstimate } from "@/features/nasabah/prototype-api";
import { usePrototype } from "@/features/nasabah/prototype-store";

const subscribeDraft = () => () => {};
const subscribeClient = () => () => {};

export default function RingkasanSetoranPage() {
  const router = useRouter();
  const { units, categories, submitDeposit } = usePrototype();

  const isClient = useSyncExternalStore(
    subscribeClient,
    () => true,
    () => false,
  );
  const draftRaw = useSyncExternalStore(subscribeDraft, getDraftSnapshot, () => null);
  const draft = useMemo(() => parseDraft(draftRaw), [draftRaw]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unit = draft ? units.find((candidate) => candidate.id === draft.unitId) : undefined;

  const estimate = useMemo(() => {
    if (!draft) return null;

    try {
      return calculateEstimate(draft, categories);
    } catch {
      return null;
    }
  }, [categories, draft]);

  async function handleSubmit(): Promise<void> {
    if (!draft) return;

    setSubmitting(true);
    setError(null);

    try {
      const deposit = await submitDeposit(draft);
      clearDraft();
      router.push(`/nasabah/setoran/${deposit.id}`);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Pengajuan gagal dibuat. Silakan coba lagi.",
      );
      setSubmitting(false);
    }
  }

  if (!isClient) {
    return <LoadingState label="Menyiapkan ringkasan setoran…" />;
  }

  if (!draft || !unit || !estimate) {
    return (
      <EmptyState
        title="Belum ada data setoran"
        description="Data ringkasan tidak ditemukan. Mulai pengajuan baru dari halaman setor."
        action={
          <Link href="/nasabah/setor" className={buttonClasses({ size: "sm" })}>
            Mulai setor
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <PrototypeNotice />

      <header className="flex flex-col gap-1">
        <p className="text-body-sm font-semibold text-accent">Langkah 3 dari 3</p>
        <h1 className="text-h2 text-foreground">Ringkasan estimasi</h1>
        <p className="text-body text-muted">
          Periksa kembali data berikut sebelum mengirim pengajuan.
        </p>
      </header>

      <Card className="border-blue-light-active bg-blue-light">
        <CardHeader>
          <p className="text-body-sm font-semibold text-blue-darker">Unit tujuan</p>
          <p className="text-body font-semibold text-blue-darker">{unit.name}</p>
          <p className="text-body-sm text-blue-darker/80">{unit.address}</p>
          <p className="text-body-sm text-blue-darker/80">{unit.hours}</p>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle>Rincian estimasi</CardTitle>
            <Badge variant="warning">Bukan nilai final</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {estimate.items.map((item) => (
            <div
              key={item.categoryId}
              className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <div className="flex flex-col gap-0.5">
                <p className="text-body font-semibold text-foreground">{item.categoryName}</p>
                <p className="text-body-sm text-muted">
                  {formatWeight(item.estimatedWeight)} × {formatRupiah(item.pricePerKg)}/kg
                </p>
              </div>
              <p className="text-body font-semibold text-foreground">
                {formatRupiah(item.estimatedValue)}
              </p>
            </div>
          ))}

          <div className="flex items-end justify-between gap-3 pt-1">
            <p className="text-body font-semibold text-foreground">Total estimasi</p>
            <p className="text-h3 text-foreground">{formatRupiah(estimate.total)}</p>
          </div>

          <div className="rounded-lg bg-brown-light px-3 py-2 text-body-sm text-brown-darker">
            Nilai ini hanya estimasi. Nilai final dihitung petugas dari berat aktual saat
            penimbangan dan harga yang berlaku saat konfirmasi.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Setelah pengajuan dikirim</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <NextStep
            number="1"
            title="Antar sampah sendiri ke unit"
            description="Tunjukkan kode pengajuan kepada petugas saat tiba."
          />
          <NextStep
            number="2"
            title="Petugas memeriksa dan menimbang"
            description="Berat aktual dapat berbeda dari estimasi Anda."
          />
          <NextStep
            number="3"
            title="Nilai final muncul setelah konfirmasi"
            description="Transaksi berstatus Selesai setelah petugas mengonfirmasi."
          />
        </CardContent>
      </Card>

      {error ? (
        <ErrorState
          title="Pengajuan gagal dibuat"
          description={error}
          onRetry={() => {
            void handleSubmit();
          }}
        />
      ) : null}

      <div className="flex flex-col gap-2">
        <Button
          type="button"
          size="lg"
          className="w-full"
          isLoading={submitting}
          loadingText="Mengirim pengajuan…"
          onClick={() => {
            void handleSubmit();
          }}
        >
          Konfirmasi pengajuan
        </Button>
        <Link
          href={`/nasabah/setor/${unit.id}`}
          className={buttonClasses({
            variant: "ghost",
            size: "md",
            className: "w-full",
          })}
        >
          Ubah jenis atau berat
        </Link>
      </div>
    </div>
  );
}

function NextStep({
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
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-body-sm font-bold text-accent-strong">
        {number}
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-body font-semibold text-foreground">{title}</p>
        <p className="text-body-sm text-muted">{description}</p>
      </div>
    </div>
  );
}
