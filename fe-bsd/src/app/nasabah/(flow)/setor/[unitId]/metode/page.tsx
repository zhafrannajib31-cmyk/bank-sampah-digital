"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Asset, Badge, StepActions, StepHeader } from "@/components/ui";
import { usePrototype } from "@/features/nasabah/prototype-store";
import { StepNext, StepScreen } from "@/features/nasabah/step-screen";

function Feature({
  icon,
  label,
  className,
}: {
  icon: ReactNodeIcon;
  label: string;
  className: string;
}) {
  return (
    <span
      className={`flex items-center gap-[6px] text-[12px] leading-[17px] font-medium ${className}`}
    >
      <Asset src={icon.src} width={icon.w} height={icon.h} />
      {label}
    </span>
  );
}

type ReactNodeIcon = { src: string; w: number; h: number };

export default function MetodePage() {
  const { unitId } = useParams<{ unitId: string }>();
  const { units } = usePrototype();
  const unit = units.find((candidate) => candidate.id === unitId);

  return (
    <StepScreen>
      <StepHeader
        title="Pilih Metode Setor"
        step={4}
        totalSteps={5}
        backHref={`/nasabah/setor/${unitId}/berat`}
      />
      <p className="text-[12px] leading-[17px] text-black/70">
        Bagaimana kamu ingin menyetorkan sampah? Pilih metode yang paling nyaman untuk lokasimu.
      </p>

      <ul className="flex flex-col gap-[10px]">
        <li>
          <div
            aria-disabled="true"
            className="relative flex min-h-[90px] flex-col gap-[7px] rounded-[15px] border-[0.5px] border-black/50 bg-white px-[14px] py-[11px] opacity-70"
          >
            <div className="flex items-center gap-[7px]">
              <span className="relative flex size-[25px] shrink-0 items-center justify-center rounded-[5px] bg-blue-light">
                <span className="relative block h-[17.6px] w-[14px]">
                  <Asset src="/nasabah/method-pin-b.svg" width={14.0833} height={17.6128} />
                  <Asset
                    src="/nasabah/method-pin-a.svg"
                    width={7.58333}
                    height={7.58333}
                    className="absolute top-[3.2px] left-[3.25px]"
                  />
                </span>
              </span>
              <p className="font-sans text-[12px] leading-[16.5px] font-medium text-black">
                Jemput oleh Petugas
              </p>
              <Badge variant="neutral" className="ml-auto">
                Segera hadir
              </Badge>
            </div>
            <p className="pl-8 text-[12px] leading-[17px] text-black/70">
              Petugas resmi Bank Sampah akan datang langsung ke lokasi yang kamu tentukan.
            </p>
            <div className="flex gap-3 pl-8">
              <Feature
                icon={{ src: "/nasabah/method-clock.svg", w: 16, h: 16 }}
                label="Jadwal Fleksibel"
                className="text-blue-dark"
              />
              <Feature
                icon={{ src: "/nasabah/method-scales.svg", w: 17, h: 20 }}
                label="Timbang di Tempat"
                className="text-green-dark-active"
              />
            </div>
          </div>
        </li>
        <li>
          <div
            aria-current="true"
            className="relative flex min-h-[90px] flex-col gap-[7px] rounded-[15px] border border-primary bg-white px-[14px] py-[11px]"
          >
            <div className="flex items-center gap-[7px]">
              <span className="flex size-[25px] shrink-0 items-center justify-center rounded-[5px] bg-green-light">
                <Asset src="/nasabah/method-person-a.svg" width={15.1667} height={18.4959} />
              </span>
              <p className="font-sans text-[12px] leading-[16.5px] font-medium text-black">
                Antar Sendiri
              </p>
              <span className="ml-auto">
                <Asset src="/nasabah/method-check.svg" width={18} height={18} />
              </span>
            </div>
            <p className="pl-8 text-[12px] leading-[17px] text-black/70">
              Bawa dan setorkan sampah langsung ke Unit Bank Sampah terdekat di kotamu.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 pl-8">
              <Feature
                icon={{ src: "/nasabah/method-bolt.svg", w: 14.2605, h: 20.647 }}
                label="Proses Cepat"
                className="text-green-dark-active"
              />
              <span className="text-[12px] leading-[17px] text-black/70">
                Buka: {unit?.shortHours.includes("besok") ? unit.hours : (unit?.shortHours ?? "-")}{" "}
                WIB
              </span>
            </div>
          </div>
        </li>
      </ul>

      <StepActions>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[12px] leading-[17px] text-black/70">
            Metode: <span className="font-semibold text-black">Antar Sendiri</span>
          </p>
          <Link
            href="/nasabah/setor/ringkasan"
            className="text-[12px] font-semibold text-blue-dark focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            Lanjut Konfirmasi
          </Link>
        </div>
        <StepNext href="/nasabah/setor/ringkasan" />
      </StepActions>
    </StepScreen>
  );
}
