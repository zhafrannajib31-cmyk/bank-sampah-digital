# be-bsd (NestJS + PostgreSQL + Prisma)

## Struktur modul (src/modules/)
auth, users, units, waste-categories, waste-prices, deposits, transactions, articles, reports.
Tiap modul: controller (HTTP) -> service (logika bisnis) -> repository/Prisma. Logika bisnis TIDAK boleh di controller.

## Database
- Skema di prisma/schema.prisma; migrasi: npx prisma migrate dev --name <nama>
- Tabel inti: users/profiles, bank_sampah_units, unit_staff, waste_categories, waste_prices, deposits, deposit_items, transactions, transaction_events, content_articles, notifications.
- waste_prices menyimpan histori (effective_from/effective_to). Prioritas harga: harga per unit menimpa harga global (konfirmasi dengan PO bila berubah).
- Jangan ubah migrasi yang sudah ter-commit; buat migrasi baru.

## Aturan
- Validasi semua input (class-validator/DTO). Berat dan harga: angka positif, presisi desimal (gunakan Decimal, bukan float).
- Penyelesaian transaksi: dalam satu DB transaction + idempotency key; cek status sebelum update; tulis transaction_events.
- Guard: JwtAuthGuard + RolesGuard + pengecekan kepemilikan (nasabah) dan keanggotaan unit (petugas) di service.
- Password di-hash (argon2/bcrypt). Token reset sekali pakai dan kedaluwarsa. Jangan log data sensitif.
- Format error konsisten: { statusCode, message, code }. Pesan untuk pengguna bahasa Indonesia.
- Setiap perubahan harga dan transaksi mencatat user dan waktu.
- Test wajib untuk: kalkulasi nilai, snapshot harga (TC-05), RBAC (TC-07, TC-08), idempotensi (TC-09).
- Seed data = data simulasi, tandai jelas.
