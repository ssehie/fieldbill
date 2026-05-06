import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { FieldBillColors } from '@/constants/fieldbill';

type FieldBillButtonProps = {
  label: string;
  detail?: string;
  onPress?: () => void;
  primary?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function FieldBillButton({
  label,
  detail,
  onPress,
  primary = false,
  disabled = false,
  style,
}: FieldBillButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        primary ? styles.primaryButton : styles.defaultButton,
        style,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        {detail ? (
          <Text numberOfLines={2} style={styles.detail}>
            {detail}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 76,
    borderRadius: 18,
    paddingHorizontal: 20,
    alignItems: 'stretch',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 3,
  },
  defaultButton: {
    backgroundColor: FieldBillColors.primary,
  },
  primaryButton: {
    minHeight: 88,
    backgroundColor: FieldBillColors.primaryStrong,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 4,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    backgroundColor: FieldBillColors.primaryDisabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  content: {
    width: '100%',
    alignItems: 'flex-start',
    gap: 4,
  },
  label: {
    fontSize: 22,
    fontWeight: '700',
    color: FieldBillColors.background,
  },
  detail: {
    fontSize: 15,
    lineHeight: 20,
    color: 'rgba(247, 243, 235, 0.88)',
  },
});
