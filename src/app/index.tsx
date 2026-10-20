import React, { useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProdukCard } from '@/components/produk-card';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { Produk } from '@/types/produk';
import { formatRupiah } from '@/utils/format';

const DATA_AWAL: Produk[] = [
  { id: 1, nama: 'Mouse Wireless', harga: 150000 },
  { id: 2, nama: 'Keyboard Mekanikal', harga: 450000 },
  { id: 3, nama: 'Monitor 24 Inch', harga: 2000000 },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // State untuk daftar produk
  const [produkList, setProdukList] = useState<Produk[]>(DATA_AWAL);

  // State untuk nilai input form
  const [nama, setNama] = useState<string>('');
  const [harga, setHarga] = useState<string>('');

  // State untuk pesan validasi error
  const [errorNama, setErrorNama] = useState<string>('');
  const [errorHarga, setErrorHarga] = useState<string>('');

  // Handler penambahan produk baru dengan validasi
  const handleTambahProduk = () => {
    let isValid = true;
    const cleanNama = nama.trim();
    const cleanHargaStr = harga.trim().replace(/\./g, '');
    const cleanHargaNum = Number(cleanHargaStr);

    // Validasi Nama Produk
    if (!cleanNama) {
      setErrorNama('Nama produk tidak boleh kosong.');
      isValid = false;
    } else {
      setErrorNama('');
    }

    // Validasi Harga Produk (harus angka positif)
    if (!cleanHargaStr) {
      setErrorHarga('Harga produk wajib diisi.');
      isValid = false;
    } else if (isNaN(cleanHargaNum) || cleanHargaNum <= 0) {
      setErrorHarga('Harga harus berupa angka positif (> 0).');
      isValid = false;
    } else {
      setErrorHarga('');
    }

    if (!isValid) {
      return;
    }

    // Buat objek produk baru dengan ID unik numerik
    const newProduk: Produk = {
      id: Date.now(),
      nama: cleanNama,
      harga: Math.round(cleanHargaNum),
    };

    // Update state daftar produk (prepend ke daftar)
    setProdukList((prev) => [newProduk, ...prev]);

    // Kosongkan form input dan hilangkan error
    setNama('');
    setHarga('');
    setErrorNama('');
    setErrorHarga('');
    Keyboard.dismiss();
  };

  // State Hoisting: Callback penghapusan produk dari anak ke induk
  const handleHapusProduk = (id: number) => {
    setProdukList((prev) => prev.filter((item) => item.id !== id));
  };

  // Perhitungan total harga inventaris
  const totalNilai = produkList.reduce((acc, curr) => acc + curr.harga, 0);

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        isDark ? styles.backgroundDark : styles.backgroundLight,
      ]}
      edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}>
        <View style={styles.centerWrapper}>
          <FlatList
            data={produkList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ProdukCard item={item} onDelete={handleHapusProduk} />
            )}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View style={styles.headerContainer}>
                {/* Judul Aplikasi */}
                <View style={styles.titleSection}>
                  <Text style={[styles.mainTitle, isDark ? styles.textDark : styles.textLight]}>
                    Manajemen Data Produk
                  </Text>
                  <Text style={[styles.subtitle, isDark ? styles.textSecondaryDark : styles.textSecondaryLight]}>
                    Modul Praktikum: State, Event &amp; Daftar Data
                  </Text>
                </View>

                {/* Ringkasan Statistik */}
                <View style={[styles.statsCard, isDark ? styles.statsCardDark : styles.statsCardLight]}>
                  <View style={styles.statCol}>
                    <Text style={[styles.statLabel, isDark ? styles.textSecondaryDark : styles.textSecondaryLight]}>
                      Total Item
                    </Text>
                    <Text style={[styles.statValue, isDark ? styles.textDark : styles.textLight]}>
                      {produkList.length}
                    </Text>
                  </View>
                  <View style={[styles.statDivider, isDark ? styles.dividerDark : styles.dividerLight]} />
                  <View style={styles.statCol}>
                    <Text style={[styles.statLabel, isDark ? styles.textSecondaryDark : styles.textSecondaryLight]}>
                      Total Nilai
                    </Text>
                    <Text style={styles.statPriceValue}>
                      {formatRupiah(totalNilai)}
                    </Text>
                  </View>
                </View>

                {/* Form Tambah Produk */}
                <View style={[styles.formCard, isDark ? styles.cardDark : styles.cardLight]}>
                  <Text style={[styles.formTitle, isDark ? styles.textDark : styles.textLight]}>
                    Tambah Produk Baru
                  </Text>

                  {/* Input Nama */}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, isDark ? styles.textDark : styles.textLight]}>
                      Nama Produk
                    </Text>
                    <TextInput
                      value={nama}
                      onChangeText={(text) => {
                        setNama(text);
                        if (errorNama) setErrorNama('');
                      }}
                      placeholder="Contoh: Headset Gaming"
                      placeholderTextColor={isDark ? '#71717a' : '#9ca3af'}
                      style={[
                        styles.input,
                        isDark ? styles.inputDark : styles.inputLight,
                        errorNama ? styles.inputError : null,
                      ]}
                      returnKeyType="next"
                    />
                    {errorNama ? (
                      <Text style={styles.errorText}>{errorNama}</Text>
                    ) : null}
                  </View>

                  {/* Input Harga */}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, isDark ? styles.textDark : styles.textLight]}>
                      Harga Produk (Rp)
                    </Text>
                    <TextInput
                      value={harga}
                      onChangeText={(text) => {
                        setHarga(text);
                        if (errorHarga) setErrorHarga('');
                      }}
                      placeholder="Contoh: 350000"
                      placeholderTextColor={isDark ? '#71717a' : '#9ca3af'}
                      keyboardType="numeric"
                      style={[
                        styles.input,
                        isDark ? styles.inputDark : styles.inputLight,
                        errorHarga ? styles.inputError : null,
                      ]}
                      returnKeyType="done"
                      onSubmitEditing={handleTambahProduk}
                    />
                    {errorHarga ? (
                      <Text style={styles.errorText}>{errorHarga}</Text>
                    ) : null}
                  </View>

                  {/* Tombol Tambah Produk */}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Tambah Produk"
                    onPress={handleTambahProduk}
                    style={({ pressed }) => [
                      styles.submitButton,
                      pressed && styles.submitButtonPressed,
                    ]}>
                    <Text style={styles.submitButtonText}>+ Tambah Produk</Text>
                  </Pressable>
                </View>

                {/* Section Header Daftar Produk */}
                <View style={styles.listSectionHeader}>
                  <Text style={[styles.listSectionTitle, isDark ? styles.textDark : styles.textLight]}>
                    Daftar Produk
                  </Text>
                  <Text style={[styles.listSectionBadge, isDark ? styles.badgeDark : styles.badgeLight]}>
                    {produkList.length} produk
                  </Text>
                </View>
              </View>
            }
            ListEmptyComponent={
              <View style={[styles.emptyCard, isDark ? styles.cardDark : styles.cardLight]}>
                <Text style={styles.emptyIcon}>📦</Text>
                <Text style={[styles.emptyTitle, isDark ? styles.textDark : styles.textLight]}>
                  Belum Ada Produk
                </Text>
                <Text style={[styles.emptySubtitle, isDark ? styles.textSecondaryDark : styles.textSecondaryLight]}>
                  Gunakan form di atas untuk menambahkan produk ke dalam daftar.
                </Text>
              </View>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  centerWrapper: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  listContent: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.five,
  },
  backgroundLight: {
    backgroundColor: '#f8fafc',
  },
  backgroundDark: {
    backgroundColor: '#090a0f',
  },
  headerContainer: {
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  titleSection: {
    marginBottom: Spacing.three,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.four,
    borderWidth: 1,
  },
  statsCardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  statsCardDark: {
    backgroundColor: '#15171c',
    borderColor: '#262930',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statPriceValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0d9488',
  },
  statDivider: {
    width: 1,
    height: 36,
  },
  dividerLight: {
    backgroundColor: '#e2e8f0',
  },
  dividerDark: {
    backgroundColor: '#262930',
  },
  formCard: {
    borderRadius: 16,
    padding: Spacing.four,
    marginBottom: Spacing.four,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  cardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  cardDark: {
    backgroundColor: '#15171c',
    borderColor: '#262930',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.three,
  },
  inputGroup: {
    marginBottom: Spacing.three,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    fontSize: 15,
  },
  inputLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    color: '#0f172a',
  },
  inputDark: {
    backgroundColor: '#1e2025',
    borderColor: '#333741',
    color: '#f8fafc',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  submitButtonPressed: {
    backgroundColor: '#1d4ed8',
    transform: [{ scale: 0.98 }],
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  listSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },
  listSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  listSectionBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  badgeLight: {
    backgroundColor: '#e2e8f0',
    color: '#475569',
  },
  badgeDark: {
    backgroundColor: '#262930',
    color: '#94a3b8',
  },
  emptyCard: {
    borderRadius: 14,
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginTop: Spacing.two,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: Spacing.two,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 18,
  },
  textLight: {
    color: '#0f172a',
  },
  textDark: {
    color: '#f8fafc',
  },
  textSecondaryLight: {
    color: '#64748b',
  },
  textSecondaryDark: {
    color: '#94a3b8',
  },
});
