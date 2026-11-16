import type { Metadata } from "next";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
  StatusBadge,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Design System",
};

const greenScale = [
  { name: "light", className: "bg-green-light" },
  { name: "light-hover", className: "bg-green-light-hover" },
  { name: "light-active", className: "bg-green-light-active" },
  { name: "normal", className: "bg-green-normal" },
  { name: "normal-hover", className: "bg-green-normal-hover" },
  { name: "normal-active", className: "bg-green-normal-active" },
  { name: "dark", className: "bg-green-dark" },
  { name: "dark-hover", className: "bg-green-dark-hover" },
  { name: "dark-active", className: "bg-green-dark-active" },
  { name: "darker", className: "bg-green-darker" },
];

const brownScale = [
  { name: "light", className: "bg-brown-light" },
  { name: "light-hover", className: "bg-brown-light-hover" },
  { name: "light-active", className: "bg-brown-light-active" },
  { name: "normal", className: "bg-brown-normal" },
  { name: "normal-hover", className: "bg-brown-normal-hover" },
  { name: "normal-active", className: "bg-brown-normal-active" },
  { name: "dark", className: "bg-brown-dark" },
  { name: "dark-hover", className: "bg-brown-dark-hover" },
  { name: "dark-active", className: "bg-brown-dark-active" },
  { name: "darker", className: "bg-brown-darker" },
];

const blueScale = [
  { name: "light", className: "bg-blue-light" },
  { name: "light-hover", className: "bg-blue-light-hover" },
  { name: "light-active", className: "bg-blue-light-active" },
  { name: "normal", className: "bg-blue-normal" },
  { name: "normal-hover", className: "bg-blue-normal-hover" },
  { name: "normal-active", className: "bg-blue-normal-active" },
  { name: "dark", className: "bg-blue-dark" },
  { name: "dark-hover", className: "bg-blue-dark-hover" },
  { name: "dark-active", className: "bg-blue-dark-active" },
  { name: "darker", className: "bg-blue-darker" },
];

const typography = [
  { name: "display", className: "text-display" },
  { name: "h1", className: "text-h1" },
  { name: "h2", className: "text-h2" },
  { name: "h3", className: "text-h3" },
  { name: "h4", className: "text-h4" },
  { name: "body-lg", className: "text-body-lg" },
  { name: "body", className: "text-body" },
  { name: "body-sm", className: "text-body-sm" },
  { name: "caption", className: "text-caption" },
];

export default function DesignSystemPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-2">
        <p className="text-caption font-semibold tracking-wide text-accent uppercase">Internal</p>
        <h1 className="text-h1 text-foreground">Design System Bank Sampah Digital</h1>
        <p className="text-body-lg text-muted">
          Halaman pratinjau token dan komponen dasar. Bukan bagian dari website publik. Sumber
          token: <code className="text-body-sm">fe-bsd/Design/design-tokens.json</code>.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-h2 text-foreground">Warna foundation</h2>
        <ColorScale title="Green — utama" scale={greenScale} />
        <ColorScale title="Brown — netral" scale={brownScale} />
        <ColorScale title="Blue — aksen" scale={blueScale} />
        <div className="flex flex-col gap-2">
          <h3 className="text-h4 text-foreground">Semantik</h3>
          <div className="flex flex-wrap gap-3">
            <Swatch name="primary" className="bg-primary" />
            <Swatch name="primary-soft" className="bg-primary-soft" />
            <Swatch name="primary-strong" className="bg-primary-strong" />
            <Swatch name="accent" className="bg-accent" />
            <Swatch name="surface" className="bg-surface" bordered />
            <Swatch name="surface-muted" className="bg-surface-muted" />
            <Swatch name="foreground" className="bg-foreground" />
            <Swatch name="muted" className="bg-muted" />
            <Swatch name="border" className="bg-border" />
            <Swatch name="danger" className="bg-danger" />
            <Swatch name="danger-soft" className="bg-danger-soft" />
            <Swatch name="danger-dark" className="bg-danger-dark" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-h2 text-foreground">Tipografi (Poppins, mobile)</h2>
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          {typography.map((item) => (
            <div
              key={item.name}
              className="flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <span className={`${item.className} text-foreground`}>Bank Sampah Digital</span>
              <code className="text-body-sm text-muted">text-{item.name}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-h2 text-foreground">Button</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Simpan</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Batalkan</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button isLoading loadingText="Menyimpan…">
            Simpan
          </Button>
          <Button disabled>Nonaktif</Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-h2 text-foreground">Input</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nama lengkap" name="nama" placeholder="Masukkan nama lengkap" />
          <Input
            label="Nomor telepon"
            name="telepon"
            hint="Contoh: 081234567890"
            placeholder="08xxxxxxxxxx"
          />
          <Input
            label="Berat estimasi (kg)"
            name="berat"
            error="Berat wajib diisi dengan angka lebih dari 0."
            defaultValue="0"
          />
          <Input label="Email" name="email" disabled defaultValue="nasabah@contoh.id" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-h2 text-foreground">Badge status setoran</h2>
        <div className="flex flex-wrap gap-3">
          <StatusBadge status="menunggu" />
          <StatusBadge status="diproses" />
          <StatusBadge status="selesai" />
          <StatusBadge status="dibatalkan" />
          <Badge variant="neutral">Netral</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-h2 text-foreground">Card</h2>
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle as="h3">Setoran #BSD-0012</CardTitle>
                <CardDescription>12 November 2026 · Unit Sukamaju</CardDescription>
              </div>
              <StatusBadge status="diproses" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-body-sm">
              <span className="text-muted">Berat estimasi</span>
              <span className="font-semibold text-foreground">2,5 kg</span>
            </div>
            <div className="flex items-center justify-between text-body-sm">
              <span className="text-muted">Nilai final</span>
              <span className="font-semibold text-foreground">Menunggu penimbangan</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="sm">Lihat detail</Button>
            <Button size="sm" variant="ghost">
              Batal
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-h2 text-foreground">State</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <EmptyState
            title="Belum ada setoran"
            description="Setoran yang Anda ajukan akan muncul di sini."
          />
          <LoadingState />
          <ErrorState />
        </div>
      </section>
    </main>
  );
}

function ColorScale({
  title,
  scale,
}: {
  title: string;
  scale: { name: string; className: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-h4 text-foreground">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {scale.map((item) => (
          <Swatch key={item.name} name={item.name} className={item.className} bordered />
        ))}
      </div>
    </div>
  );
}

function Swatch({
  name,
  className,
  bordered = false,
}: {
  name: string;
  className: string;
  bordered?: boolean;
}) {
  return (
    <div className="flex w-24 flex-col gap-1">
      <div
        className={`h-12 w-full rounded-lg ${className} ${bordered ? "border border-border" : ""}`}
      />
      <span className="text-caption text-muted">{name}</span>
    </div>
  );
}
