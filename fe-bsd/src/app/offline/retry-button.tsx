"use client";

export function RetryButton() {
  return (
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="flex h-[49px] w-[180px] items-center justify-center rounded-[28px] border border-primary bg-white font-sans text-[16px] font-semibold text-green-dark-active focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
    >
      Coba Lagi
    </button>
  );
}
