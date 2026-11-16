"use client";

import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  buttonClasses,
} from "@/components/ui";
import { formatDistance } from "@/features/nasabah/format";
import { PrototypeNotice } from "@/features/nasabah/prototype-notice";
import { usePrototype } from "@/features/nasabah/prototype-store";

export default function PilihUnitPage() {
  const { units } = usePrototype();

  return (
    <div className="flex flex-col gap-5">
      <PrototypeNotice />

      <header className="flex flex-col gap-1">
        <p className="text-body-sm font-semibold text-accent">Langkah 1 dari 3</p>
        <h1 className="text-h2 text-foreground">Pilih unit Bank Sampah</h1>
        <p className="text-body text-muted">
          Antar sendiri sampah Anda ke unit yang dipilih. Pastikan unit sedang buka saat Anda
          datang.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {units.map((unit) => (
          <Card key={unit.id} className={unit.isOpen ? undefined : "opacity-70"}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <CardTitle>{unit.name}</CardTitle>
                  <CardDescription>{unit.address}</CardDescription>
                </div>
                <Badge variant={unit.isOpen ? "success" : "neutral"}>
                  {unit.isOpen ? "Buka" : "Tutup sementara"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-1.5 text-body-sm text-muted">
              <p>Jam operasional: {unit.hours}</p>
              <p>Telepon: {unit.phone}</p>
              <p>Jarak: {formatDistance(unit.distanceKm)} dari lokasi simulasi</p>
            </CardContent>
            <CardFooter>
              {unit.isOpen ? (
                <Link href={`/nasabah/setor/${unit.id}`} className={buttonClasses({ size: "sm" })}>
                  Pilih unit
                </Link>
              ) : (
                <Button size="sm" disabled>
                  Sedang tutup
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
