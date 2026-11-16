"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonClasses } from "@/components/ui";
import { linkClass } from "./auth-card";

const slides = [
  {
    title: "Catat setoran sampah Anda",
    body: "Ajukan setoran, lalu petugas Bank Sampah menimbang dan mencatat nilainya.",
  },
  {
    title: "Antar sendiri atau minta jemput",
    body: "Pilih cara menyetor yang paling nyaman. Penjemputan oleh petugas tersedia di unit tertentu.",
  },
  {
    title: "Pantau status setoran",
    body: "Lihat setoran Anda dari Menunggu, Diproses, sampai Selesai, lengkap dengan riwayatnya.",
  },
];

const SEEN_KEY = "bsd:onboarding-seen";

export function Onboarding() {
  // -1 = splash singkat sebelum slide pertama
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    if (index !== -1) return;
    const timer = setTimeout(() => setIndex(0), 1200);
    return () => clearTimeout(timer);
  }, [index]);

  function markSeen() {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Penyimpanan diblokir: onboarding hanya akan tampil lagi, tidak merusak apa pun.
    }
  }

  if (index === -1) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
        <span className="flex size-20 items-center justify-center rounded-full bg-primary text-h3 font-bold text-foreground">
          BS
        </span>
        <p className="text-h4 text-foreground">Bank Sampah Digital</p>
      </main>
    );
  }

  const slide = slides[index];
  const isLast = index === slides.length - 1;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-between gap-8 px-6 py-8">
      <div className="flex justify-end">
        <Link href="/login" onClick={markSeen} className={linkClass}>
          Lewati
        </Link>
      </div>

      <div className="flex flex-col items-center gap-4 text-center">
        <span
          aria-hidden
          className="flex size-32 items-center justify-center rounded-full bg-green-light text-h1 font-bold text-green-darker"
        >
          {index + 1}
        </span>
        <h1 className="text-h3 text-foreground">{slide.title}</h1>
        <p className="text-body text-muted">{slide.body}</p>
      </div>

      <div className="flex flex-col gap-5">
        <div
          role="img"
          aria-label={`Slide ${index + 1} dari ${slides.length}`}
          className="flex justify-center gap-2"
        >
          {slides.map((_, dot) => (
            <span
              key={dot}
              aria-hidden
              className={`h-2 rounded-full transition-all ${
                dot === index ? "w-6 bg-green-dark" : "w-2 bg-brown-light-active"
              }`}
            />
          ))}
        </div>
        {isLast ? (
          <Link
            href="/login"
            onClick={markSeen}
            className={buttonClasses({ size: "lg", className: "w-full" })}
          >
            Mulai
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setIndex(index + 1)}
            className={buttonClasses({ size: "lg", className: "w-full" })}
          >
            Lanjut
          </button>
        )}
      </div>
    </main>
  );
}
