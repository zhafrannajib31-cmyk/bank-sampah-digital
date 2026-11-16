import { Asset } from "@/components/ui";

/** Ikon kategori dari Figma. Ada yang sudah berupa ubin (38 px termasuk bayangan), ada ikon polos. */
const tiles: Record<string, { src: string; w: number; h: number; plain?: boolean }> = {
  plastik: { src: "/nasabah/cat-plastik-selected.svg", w: 139, h: 38 },
  kertas: { src: "/nasabah/cat-kertas.svg", w: 38, h: 38 },
  kardus: { src: "/nasabah/cat-kardus-selected.svg", w: 139, h: 38 },
  logam: { src: "/nasabah/cat-logam-icon.svg", w: 18, h: 18, plain: true },
  "botol-kaca": { src: "/nasabah/cat-botol-kaca.svg", w: 38, h: 38 },
  elektronik: { src: "/nasabah/cat-elektronik-icon.svg", w: 20, h: 20, plain: true },
};

/** Ubin ikon 30 px. SVG gabungan (ubin + tanda centang) dipotong hanya ubinnya. */
export function CategoryTile({ id }: { id: string }) {
  const tile = tiles[id];
  if (!tile) return <span className="block size-[30px]" />;

  return (
    <span className="relative block size-[30px] shrink-0" aria-hidden>
      {tile.plain ? (
        <span className="flex size-[30px] items-center justify-center rounded-[10px] bg-white shadow-[0_4px_2px_rgba(0,0,0,0.05)]">
          <Asset src={tile.src} width={tile.w} height={tile.h} />
        </span>
      ) : (
        <span className="absolute top-0 -left-1 block h-[38px] w-[38px] overflow-hidden">
          <Asset src={tile.src} width={tile.w} height={tile.h} className="max-w-none" />
        </span>
      )}
    </span>
  );
}

export function CheckBadge() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="#00ea56" />
      <path
        d="m5 9.2 2.8 2.8L13 6.6"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
