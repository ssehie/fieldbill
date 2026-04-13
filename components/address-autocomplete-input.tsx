import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import { FieldBillColors } from '@/constants/fieldbill';
import {
  formatStructuredAddress,
  type StructuredAddress,
  structuredAddressFromLocationPlacemark,
  structuredAddressFromGooglePlace,
} from '@/lib/address';

type AddressSuggestion = {
  placeId: string;
  text: string;
};

type AddressAutocompleteInputProps = Omit<TextInputProps, 'style' | 'value' | 'onChangeText'> & {
  value: string;
  onChangeText: (value: string) => void;
  onSelectAddress?: (value: StructuredAddress) => void;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY?.trim() ?? '';
const AUTOCOMPLETE_URL = 'https://places.googleapis.com/v1/places:autocomplete';
const PLACE_DETAILS_URL = 'https://places.googleapis.com/v1/places';

export function AddressAutocompleteInput({
  value,
  onChangeText,
  onSelectAddress,
  style,
  inputStyle,
  onBlur,
  ...inputProps
}: AddressAutocompleteInputProps) {
  const [suggestions, setSuggestions] = React.useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLocating, setIsLocating] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [isManualMode, setIsManualMode] = React.useState(false);
  const [helperText, setHelperText] = React.useState('');
  const sessionTokenRef = React.useRef<string>(createSessionToken());
  const inputRef = React.useRef<TextInput | null>(null);

  React.useEffect(() => {
    if (!GOOGLE_PLACES_API_KEY || value.trim().length < 3 || !isFocused || isManualMode) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    let isActive = true;
    const timeoutId = setTimeout(() => {
      void fetchSuggestions(value.trim(), sessionTokenRef.current)
        .then((nextSuggestions) => {
          if (!isActive) {
            return;
          }

          setSuggestions(nextSuggestions);
        })
        .catch(() => {
          if (!isActive) {
            return;
          }

          setSuggestions([]);
        })
        .finally(() => {
          if (isActive) {
            setIsLoading(false);
          }
        });
    }, 250);

    setIsLoading(true);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [isFocused, isManualMode, value]);

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    onChangeText(suggestion.text);
    setSuggestions([]);
    setIsFocused(false);
    setIsManualMode(false);
    setHelperText('Address selected. You can still edit it if Google got part of it wrong.');

    if (!GOOGLE_PLACES_API_KEY || !onSelectAddress) {
      sessionTokenRef.current = createSessionToken();
      return;
    }

    void fetchPlaceDetails(suggestion.placeId)
      .then((address) => {
        if (address) {
          onSelectAddress(address);
        }
      })
      .finally(() => {
        sessionTokenRef.current = createSessionToken();
      });
  };

  const handleUseCurrentLocation = async () => {
    setSuggestions([]);
    setIsManualMode(true);
    setHelperText('');
    setIsLocating(true);

    try {
      const Location = await import('expo-location');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setHelperText('Location permission is off. You can still type the address manually.');
        return;
      }

      const position =
        (await Location.getLastKnownPositionAsync()) ??
        (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));

      if (!position) {
        setHelperText('Could not get your current location. You can still type the address manually.');
        return;
      }

      const [place] = await Location.reverseGeocodeAsync(position.coords);
      if (!place) {
        setHelperText('Could not turn your location into an address. You can still type it manually.');
        return;
      }

      const structuredAddress = structuredAddressFromLocationPlacemark(place);
      const formattedAddress = formatStructuredAddress(structuredAddress);

      if (!formattedAddress) {
        setHelperText('Could not build an address from your location. You can still type it manually.');
        return;
      }

      onChangeText(formattedAddress);
      onSelectAddress?.({
        ...structuredAddress,
        formattedAddress,
      });
      setHelperText('Current location added. Adjust anything that looks off.');
      requestAnimationFrame(() => inputRef.current?.focus());
    } catch {
      setHelperText('Could not use current location right now. You can still type the address manually.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleManualMode = () => {
    setIsManualMode((current) => {
      const next = !current;
      setSuggestions([]);
      setHelperText(
        next ? 'Manual entry is on. Type whatever is closest and keep moving.' : ''
      );
      return next;
    });
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <View style={style}>
      <View style={styles.inputShell}>
        <TextInput
          {...inputProps}
          ref={inputRef}
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={(nextValue) => {
            onChangeText(nextValue);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={(event) => {
            setTimeout(() => setIsFocused(false), 120);
            onBlur?.(event);
          }}
        />
        {isLoading || isLocating ? (
          <ActivityIndicator size="small" color={FieldBillColors.primaryStrong} />
        ) : null}
      </View>

      <View style={styles.actionsRow}>
        <Pressable
          onPress={() => {
            void handleUseCurrentLocation();
          }}
          style={[styles.actionButton, (isLocating || isLoading) && styles.actionButtonDisabled]}>
          <Text style={styles.actionButtonText}>
            {isLocating ? 'Finding...' : 'Use Current Location'}
          </Text>
        </Pressable>
        <Pressable onPress={handleManualMode} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>{isManualMode ? 'Use Search' : 'Type Manually'}</Text>
        </Pressable>
      </View>

      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}

      {GOOGLE_PLACES_API_KEY && isFocused && suggestions.length > 0 ? (
        <View style={styles.dropdown}>
          {suggestions.map((suggestion) => (
            <Pressable
              key={suggestion.placeId}
              onPress={() => handleSelectSuggestion(suggestion)}
              style={styles.suggestionButton}>
              <Text style={styles.suggestionText}>{suggestion.text}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

async function fetchSuggestions(
  input: string,
  sessionToken: string
): Promise<AddressSuggestion[]> {
  const response = await fetch(AUTOCOMPLETE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text',
    },
    body: JSON.stringify({
      input,
      sessionToken,
      regionCode: 'us',
    }),
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as {
    suggestions?: Array<{
      placePrediction?: {
        placeId?: string;
        text?: { text?: string };
      };
    }>;
  };

  return (data.suggestions ?? [])
    .map((item) => ({
      placeId: item.placePrediction?.placeId ?? '',
      text: item.placePrediction?.text?.text ?? '',
    }))
    .filter((item) => item.placeId && item.text);
}

function createSessionToken(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function fetchPlaceDetails(placeId: string): Promise<StructuredAddress | null> {
  const response = await fetch(`${PLACE_DETAILS_URL}/${encodeURIComponent(placeId)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask': 'formattedAddress,addressComponents',
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    formattedAddress?: string;
    addressComponents?: Array<{
      longText?: string;
      shortText?: string;
      types?: string[];
    }>;
  };

  if (!data.formattedAddress) {
    return null;
  }

  return structuredAddressFromGooglePlace(data.formattedAddress, data.addressComponents);
}

const styles = StyleSheet.create({
  inputShell: {
    minHeight: 62,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    backgroundColor: FieldBillColors.background,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    minHeight: 62,
    fontSize: 21,
    color: FieldBillColors.text,
    paddingVertical: 14,
  },
  dropdown: {
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    backgroundColor: FieldBillColors.surface,
    overflow: 'hidden',
  },
  suggestionButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ebe5da',
  },
  suggestionText: {
    fontSize: 17,
    lineHeight: 24,
    color: FieldBillColors.text,
  },
  actionsRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    backgroundColor: FieldBillColors.surface,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    fontSize: 14,
    color: FieldBillColors.primaryStrong,
    fontWeight: '700',
  },
  helperText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: FieldBillColors.mutedText,
  },
});
