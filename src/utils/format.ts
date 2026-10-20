/**
 * Memformat angka numerik ke format mata uang Rupiah.
 * Contoh: 150000 -> "Rp150.000"
 */
export function formatRupiah(value: number): string {
  if (isNaN(value)) {
    return 'Rp0';
  }
  const formatted = Math.floor(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp${formatted}`;
}
