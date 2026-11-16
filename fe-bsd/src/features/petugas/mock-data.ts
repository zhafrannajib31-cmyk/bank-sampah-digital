import { seedDeposit } from "@/features/nasabah/mock-data";
import type { Deposit } from "@/features/nasabah/types";

// Data contoh (SIMULASI) antrean Unit Sukamaju, mengikuti desain Figma "Prototype PWA".
export const OFFICER_NAME = "Andi Pratama";
export const OFFICER_UNIT = "Unit Sukamaju";
export const PETUGAS_TODAY = "2026-11-16";
export const PETUGAS_YESTERDAY = "2026-11-15";

const UNIT = "unit-sukamaju";
const at = (time: string, day = PETUGAS_TODAY) => `${day}T${time}:00+07:00`;

function waiting(
  code: string,
  name: string,
  time: string,
  rows: [string, number][],
  method?: "pickup",
  customerNote?: string,
): Deposit {
  return seedDeposit(code, UNIT, "menunggu", at(time), rows, {
    customerName: name,
    method,
    customerNote,
  });
}

function processing(code: string, name: string, time: string, rows: [string, number][]): Deposit {
  return seedDeposit(code, UNIT, "diproses", at(time), rows, {
    customerName: name,
    officerName: OFFICER_NAME,
  });
}

function done(
  code: string,
  name: string,
  time: string,
  category: string,
  kg: number,
  day = PETUGAS_TODAY,
): Deposit {
  return seedDeposit(code, UNIT, "selesai", at(time, day), [[category, kg, kg]], {
    customerName: name,
    officerName: OFFICER_NAME,
    completedAt: at(time, day),
  });
}

export const petugasDeposits: Deposit[] = [
  waiting("SET-0194", "Rahmat Hidayat", "11:20", [["kardus", 2.0]]),
  waiting(
    "SET-0192",
    "Budi Santoso",
    "10:45",
    [
      ["plastik", 5.0],
      ["kardus", 3.0],
    ],
    undefined,
    "Sampah sudah dipilah dan bersih.",
  ),
  waiting("SET-0195", "Dewi Lestari", "10:10", [["kertas", 6.0]]),
  waiting("SET-0196", "Hendra Kusuma", "09:40", [["kertas", 3.0]], "pickup"),
  processing("SET-0193", "Siti Aminah", "11:00", [["kertas", 4.5]]),
  processing("SET-0190", "Agus Salim", "09:15", [["plastik", 2.0]]),
  done("SET-0188", "Lina Marlina", "08:50", "plastik", 5.2),
  done("SET-0187", "Yusuf Hakim", "08:35", "kertas", 4.0),
  done("SET-0186", "Maya Sari", "08:20", "logam", 6.5),
  done("SET-0185", "Eko Prasetyo", "08:10", "kardus", 3.8),
  done("SET-0184", "Nina Wulandari", "08:05", "plastik", 7.0),
  done("SET-0183", "Fajar Nugroho", "08:02", "kertas", 5.4),
  done("SET-0182", "Tono Wijaya", "08:00", "botol-kaca", 6.5),
  seedDeposit("SET-0189", UNIT, "dibatalkan", at("08:30"), [["kardus", 1.5]], {
    customerName: "Rina Marlina",
    cancellationReason: "Sampah bercampur limbah B3",
    cancelledAt: at("08:45"),
    cancelledBy: `Petugas Unit (${OFFICER_NAME})`,
  }),
  // Kemarin
  done("SET-0179", "Dewi Lestari", "15:30", "kertas", 4.0, PETUGAS_YESTERDAY),
  done("SET-0178", "Andi Wijaya", "14:10", "botol-kaca", 6.0, PETUGAS_YESTERDAY),
  done("SET-0177", "Maya Putri", "10:20", "plastik", 5.5, PETUGAS_YESTERDAY),
];
