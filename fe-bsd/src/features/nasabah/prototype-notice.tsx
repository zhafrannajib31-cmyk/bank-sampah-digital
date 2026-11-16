import type { ReactNode } from "react";

export function PrototypeNotice({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-blue-light-active bg-blue-light px-4 py-3 text-body-sm text-blue-darker">
      {children ??
        "Mode prototype: data di halaman ini adalah simulasi dan disimpan di perangkat Anda."}
    </div>
  );
}
