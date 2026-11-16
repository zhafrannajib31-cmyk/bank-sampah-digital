"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Asset } from "@/components/ui/asset";

const SEEN_KEY = "bsd:onboarding-seen";
const SLIDES = 3;

function markSeen() {
  try {
    localStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Penyimpanan diblokir: onboarding hanya tampil lagi, tidak merusak apa pun.
  }
}

export function Onboarding() {
  // -1 = splash; tap atau tunggu sebentar untuk lanjut ke slide pertama.
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    if (index !== -1) return;
    const timer = setTimeout(() => setIndex(0), 1500);
    return () => clearTimeout(timer);
  }, [index]);

  if (index === -1) return <Splash onContinue={() => setIndex(0)} />;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col bg-white">
      <div className="flex items-center justify-between px-[19px] pt-[13px]">
        <span
          className={cn(
            "flex h-[26px] items-center gap-[6px] rounded-full px-[10px] font-sans text-[12px] font-semibold tracking-[0.5px] text-green-dark-active uppercase",
            index > 0 && "bg-lavender",
          )}
        >
          <Asset src="/onboarding/icon-leaf.svg" width={12.7821} height={12.7685} />
          Langkah {index + 1}/{SLIDES}
        </span>
        <Link
          href="/login"
          onClick={markSeen}
          className="inline-flex min-h-11 min-w-11 items-center justify-end font-sans text-[12px] text-slate focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          Lewati
        </Link>
      </div>

      {index === 0 ? <SlideOne /> : index === 1 ? <SlideTwo /> : <SlideThree />}

      <div className="mt-auto px-[15px] pt-6 pb-[14px]">
        {index === 0 ? (
          <NextButton onClick={() => setIndex(1)} className="mx-auto max-w-[340px]" />
        ) : index === 1 ? (
          <div className="flex gap-[7px]">
            <button
              type="button"
              onClick={() => setIndex(0)}
              className="h-[50px] w-[136px] shrink-0 rounded-full bg-lavender-strong font-sans text-[14px] font-medium text-slate focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              Kembali
            </button>
            <NextButton onClick={() => setIndex(2)} className="flex-1" />
          </div>
        ) : (
          <Link
            href="/login"
            onClick={markSeen}
            className="mx-auto flex h-[50px] w-full max-w-[340px] items-center justify-center rounded-full bg-primary font-sans text-[14px] font-bold text-foreground transition-colors hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Mulai Sekarang
          </Link>
        )}
      </div>
    </main>
  );
}

function Splash({ onContinue }: { onContinue: () => void }) {
  return (
    <button
      type="button"
      onClick={onContinue}
      aria-label="Bank Sampah Digital. Ketuk untuk melanjutkan"
      className="flex min-h-dvh w-full items-center justify-center bg-linear-[205deg] from-accent from-11% to-primary to-110%"
    >
      <span className="relative block h-[131px] w-[130px]">
        <Image
          src="/auth/logo-splash.svg"
          width={138}
          height={139.022}
          alt=""
          priority
          unoptimized
          className="absolute top-0 left-0 max-w-none"
        />
      </span>
    </button>
  );
}

function NextButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-[50px] w-full items-center justify-center gap-1 rounded-full bg-primary font-sans text-[14px] font-bold text-foreground transition-colors hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none",
        className,
      )}
    >
      Lanjut
      <Asset src="/onboarding/icon-arrow-dark.svg" width={13.3333} height={13.3333} />
    </button>
  );
}

function Dots({ active }: { active: number }) {
  return (
    <div className="mt-5 flex items-end justify-center gap-[10px]" aria-hidden>
      {Array.from({ length: SLIDES }, (_, dot) => (
        <span
          key={dot}
          className={cn(
            "rounded-full",
            dot === active ? "h-[11px] w-10 bg-primary" : "size-3 bg-lavender-dot",
          )}
        />
      ))}
    </div>
  );
}

function Copy({
  title,
  accent,
  body,
  tight,
}: {
  title: string;
  accent: ReactNode;
  body: string;
  tight?: boolean;
}) {
  return (
    <div className="mx-auto mt-[25px] flex w-full max-w-[316px] flex-col items-center gap-[3px] px-2 text-center">
      <h1
        className={cn(
          "font-sans text-[20px] leading-[30px] font-bold text-ink",
          tight && "tracking-[-0.55px]",
        )}
      >
        {title} {accent}
      </h1>
      <p className="font-inter text-[12px] leading-[20px] text-slate">{body}</p>
    </div>
  );
}

function Chip({
  circle,
  icon,
  label,
  circleSize = 30,
  labelClass = "font-sans",
}: {
  circle: string;
  icon?: { src: string; w: number; h: number };
  label: string;
  circleSize?: number;
  labelClass?: string;
}) {
  return (
    <li className="flex h-[70px] w-[100px] flex-col items-center rounded-[15px] bg-lavender pt-[11px] shadow-[0_1px_5px_rgba(0,0,0,0.1)]">
      <span
        className="relative flex items-center justify-center"
        style={{ width: circleSize, height: circleSize }}
      >
        <Asset src={circle} width={circleSize} height={circleSize} className="absolute inset-0" />
        {icon ? <Asset src={icon.src} width={icon.w} height={icon.h} className="relative" /> : null}
      </span>
      <span
        className={cn(
          "mt-[4px] text-[12px] leading-[17px] font-semibold whitespace-nowrap text-ink",
          labelClass,
        )}
      >
        {label}
      </span>
    </li>
  );
}

function SlideOne() {
  return (
    <>
      <div className="relative mx-[22px] mt-[15px] h-[337px] overflow-hidden rounded-[30px] shadow-[0_4px_4px_rgba(0,0,0,0.05)]">
        <Image
          src="/onboarding/hero-1.jpg"
          alt="Warga memilah sampah ke tempat sampah daur ulang"
          fill
          priority
          sizes="347px"
          className="object-cover"
        />
      </div>
      <Dots active={0} />
      <Copy
        title="Kelola Sampah"
        accent={<span className="text-primary">Lebih Mudah</span>}
        body="Pilah dan setorkan sampah anorganikmu secara digital langsung dari aplikasi. Pantau jenis, berat, dan riwayat setoran tanpa repot."
      />
      <ul className="mx-auto mt-[17px] flex gap-[10px]">
        <Chip
          circle="/onboarding/chip-bg-green.svg"
          icon={{ src: "/onboarding/icon-pilah.svg", w: 15, h: 15 }}
          label="Pilah Mandiri"
        />
        <Chip
          circle="/onboarding/chip-bg-green-2.svg"
          icon={{ src: "/onboarding/icon-timbang.svg", w: 15, h: 15 }}
          label="Timbang"
        />
        <Chip
          circle="/onboarding/chip-bg-green-2.svg"
          icon={{ src: "/onboarding/icon-saldo.svg", w: 14.25, h: 13.5 }}
          label="Jadi Saldo"
        />
      </ul>
    </>
  );
}

function WideChip({
  circle,
  icon,
  title,
  subtitle,
  titleClass,
}: {
  circle: string;
  icon: { src: string; w: number; h: number };
  title: string;
  subtitle: string;
  titleClass: string;
}) {
  return (
    <li className="flex h-[48px] w-[160px] items-center gap-[6px] rounded-[20px] bg-lavender-strong px-2 shadow-[0_4px_2px_rgba(0,0,0,0.05)]">
      <span className="relative flex size-8 shrink-0 items-center justify-center">
        <Asset src={circle} width={32} height={32} className="absolute inset-0" />
        <Asset src={icon.src} width={icon.w} height={icon.h} className="relative" />
      </span>
      <span className="flex flex-col font-jakarta text-[12px] leading-[17px] whitespace-nowrap">
        <span className={cn("font-bold", titleClass)}>{title}</span>
        <span className="font-semibold text-ink">{subtitle}</span>
      </span>
    </li>
  );
}

function SlideTwo() {
  return (
    <>
      <div className="relative mx-[19px] mt-[15px] flex h-[336px] flex-col rounded-[30px] bg-white px-[21px] py-[43px] shadow-[0_4px_2px_rgba(0,0,0,0.1)]">
        <div className="relative w-full flex-1 overflow-hidden">
          <Image
            src="/onboarding/hero-2.jpg"
            alt="Armada penjemputan sampah ramah lingkungan dan aplikasi pelacakan"
            width={512}
            height={512}
            priority
            className="absolute top-[-22.89%] left-[-8.24%] h-[146.77%] w-[115.69%] max-w-none"
          />
        </div>
      </div>
      <Dots active={1} />
      <Copy
        title="Sampah Dijemput ke"
        tight
        accent={<span className="text-accent">Lokasimu</span>}
        body="Tak perlu keluar rumah. Jadwalkan waktu penjemputan sampah dan kurir ramah lingkungan kami akan segera tiba di alamatmu."
      />
      <ul className="mx-auto mt-[17px] flex gap-[7px]">
        <WideChip
          circle="/onboarding/chip-bg-blue.svg"
          icon={{ src: "/onboarding/icon-gps.svg", w: 13.5, h: 13.5 }}
          title="Live Tracking"
          subtitle="Pantau via GPS"
          titleClass="text-blue-dark"
        />
        <WideChip
          circle="/onboarding/chip-bg-green-3.svg"
          icon={{ src: "/onboarding/icon-zero-emission.svg", w: 12, h: 12 }}
          title="Zero Emission"
          subtitle="100% Armada EV"
          titleClass="text-green-dark-active"
        />
      </ul>
    </>
  );
}

function SlideThree() {
  return (
    <>
      <div className="relative mx-[21px] mt-[15px] flex h-[336px] items-start justify-between rounded-[30px] bg-white py-2 pr-[13px] pl-3 shadow-[0_4px_2px_rgba(0,0,0,0.1)]">
        <div className="relative aspect-square min-w-px flex-1 overflow-hidden rounded-[30px]">
          <Image
            src="/onboarding/hero-3.jpg"
            alt="Ilustrasi saldo setoran dari sampah daur ulang"
            fill
            priority
            sizes="308px"
            className="object-cover"
          />
        </div>
        <span className="absolute top-[14px] right-[21px] flex items-center gap-[6px] rounded-full bg-white/90 px-3 py-[6px] shadow-md backdrop-blur-[6px]">
          <Asset src="/onboarding/icon-dollar.svg" width={13.3333} height={13.3333} />
          <span className="font-jakarta text-[12px] leading-[17px] font-bold text-ink">
            Rp28.300
          </span>
        </span>
      </div>
      <Dots active={2} />
      <Copy
        title="Sampahmu Jadi Lebih"
        tight
        accent={<span className="text-primary">Bernilai</span>}
        body="Setoranmu tercatat sebagai saldo setoran. Saldo adalah catatan nilai setoran, bukan dana yang bisa ditarik atau dicairkan."
      />
      <ul className="mx-auto mt-[17px] flex gap-[10px]">
        <Chip
          circle="/onboarding/chip-catat-saldo.svg"
          circleSize={32}
          label="Catat Saldo"
          labelClass="font-inter"
        />
        <Chip
          circle="/onboarding/chip-lihat-riwayat.svg"
          circleSize={32}
          label="Lihat Riwayat"
          labelClass="font-inter"
        />
        <Chip
          circle="/onboarding/chip-pantau-status.svg"
          circleSize={32}
          label="Pantau Status"
          labelClass="font-inter"
        />
      </ul>
    </>
  );
}
