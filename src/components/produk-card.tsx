import React from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { Spacing } from '@/constants/theme';
import { Produk } from '@/types/produk';
import { formatRupiah } from '@/utils/format';

interface ProdukCardProps {
  item: Produk;
  onDelete: (id: number) => void;
}

export function ProdukCard({ item, onDelete }: ProdukCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handlePressDelete = () => {
    if (Platform.OS === 'web') {
      const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus "${item.nama}"?`);
      if (confirmDelete) {
        onDelete(item.id);
      }
    } else {
      Alert.alert(
        'Konfirmasi Hapus',
        `Apakah Anda yakin ingin menghapus "${item.nama}"?`,
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Hapus',
            style: 'destructive',
            onPress: () => onDelete(item.id),
          },
        ]
      );
    }
  };

  return (
    <View
      style={[
        styles.card,
        isDark ? styles.cardDark : styles.cardLight,
      ]}>
      <View style={styles.infoContainer}>
        <View style={styles.badgeRow}>
          <View style={[styles.idBadge, isDark ? styles.idBadgeDark : styles.idBadgeLight]}>
            <Text style={[styles.idBadgeText, isDark ? styles.textSecondaryDark : styles.textSecondaryLight]}>
              ID: #{item.id}
            </Text>
          </View>
        </View>

        <Text
          numberOfLines={2}
          style={[styles.productName, isDark ? styles.textDark : styles.textLight]}>
          {item.nama}
        </Text>

        <Text style={styles.productPrice}>
          {formatRupiah(item.harga)}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Hapus produk ${item.nama}`}
        onPress={handlePressDelete}
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.deleteButtonPressed,
        ]}>
        <Text style={styles.deleteButtonText}>Hapus</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: 14,
    marginBottom: Spacing.two,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  cardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e8e8ed',
  },
  cardDark: {
    backgroundColor: '#1b1c1e',
    borderColor: '#2e3135',
  },
  infoContainer: {
    flex: 1,
    marginRight: Spacing.three,
    gap: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  idBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  idBadgeLight: {
    backgroundColor: '#f1f3f5',
  },
  idBadgeDark: {
    backgroundColor: '#26282b',
  },
  idBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0d9488',
    marginTop: 2,
  },
  textLight: {
    color: '#111827',
  },
  textDark: {
    color: '#f9fafb',
  },
  textSecondaryLight: {
    color: '#6b7280',
  },
  textSecondaryDark: {
    color: '#9ca3af',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
    minWidth: 74,
  },
  deleteButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
