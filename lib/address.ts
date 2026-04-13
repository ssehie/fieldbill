export type StructuredAddress = {
  formattedAddress: string;
  street1: string;
  city: string;
  state: string;
  postalCode: string;
};

type GoogleAddressComponent = {
  longText?: string;
  shortText?: string;
  types?: string[];
};

const EMPTY_STRUCTURED_ADDRESS: StructuredAddress = {
  formattedAddress: '',
  street1: '',
  city: '',
  state: '',
  postalCode: '',
};

export function emptyStructuredAddress(): StructuredAddress {
  return { ...EMPTY_STRUCTURED_ADDRESS };
}

export function normalizeStructuredAddress(
  value: Partial<StructuredAddress> | null | undefined
): StructuredAddress {
  return {
    formattedAddress: value?.formattedAddress?.trim() ?? '',
    street1: value?.street1?.trim() ?? '',
    city: value?.city?.trim() ?? '',
    state: value?.state?.trim() ?? '',
    postalCode: value?.postalCode?.trim() ?? '',
  };
}

export function hasStructuredAddress(value: Partial<StructuredAddress> | null | undefined): boolean {
  const normalized = normalizeStructuredAddress(value);
  return Boolean(
    normalized.street1 || normalized.city || normalized.state || normalized.postalCode
  );
}

export function isStructuredAddressMatch(
  text: string,
  value: Partial<StructuredAddress> | null | undefined
): boolean {
  const normalizedText = text.trim();
  const normalized = normalizeStructuredAddress(value);
  return Boolean(normalizedText) && normalizedText === normalized.formattedAddress;
}

export function toStructuredAddressRecord(
  text: string,
  value: Partial<StructuredAddress> | null | undefined
): StructuredAddress {
  const normalized = normalizeStructuredAddress(value);
  const formattedAddress = normalized.formattedAddress || text.trim();

  return {
    ...normalized,
    formattedAddress,
  };
}

export function formatStructuredAddress(value: Partial<StructuredAddress> | null | undefined): string {
  const normalized = normalizeStructuredAddress(value);
  if (normalized.formattedAddress) {
    return normalized.formattedAddress;
  }

  const locality = [normalized.city, normalized.state, normalized.postalCode]
    .filter(Boolean)
    .join(' ');
  return [normalized.street1, locality].filter(Boolean).join(', ');
}

export function formatStructuredAddressLines(
  value: Partial<StructuredAddress> | null | undefined
): string[] {
  const normalized = normalizeStructuredAddress(value);
  const locality = [normalized.city, normalized.state, normalized.postalCode]
    .filter(Boolean)
    .join(' ');
  const lines = [normalized.street1, locality].filter(Boolean);

  if (lines.length > 0) {
    return lines;
  }

  return normalized.formattedAddress ? [normalized.formattedAddress] : [];
}

export function structuredAddressFromGooglePlace(
  formattedAddress: string,
  components: GoogleAddressComponent[] | null | undefined
): StructuredAddress {
  const normalizedAddress = formattedAddress.trim();
  const streetNumber = findComponent(components, 'street_number')?.longText ?? '';
  const route = findComponent(components, 'route')?.longText ?? '';
  const subpremise = findComponent(components, 'subpremise')?.longText ?? '';
  const locality =
    findComponent(components, 'locality')?.longText ??
    findComponent(components, 'postal_town')?.longText ??
    findComponent(components, 'sublocality_level_1')?.longText ??
    '';
  const state =
    findComponent(components, 'administrative_area_level_1')?.shortText ??
    findComponent(components, 'administrative_area_level_1')?.longText ??
    '';
  const postalCode = findComponent(components, 'postal_code')?.longText ?? '';

  const streetBase = [streetNumber, route].filter(Boolean).join(' ').trim();
  const street1 = [streetBase, subpremise].filter(Boolean).join(', ');

  return normalizeStructuredAddress({
    formattedAddress: normalizedAddress,
    street1,
    city: locality,
    state,
    postalCode,
  });
}

export function structuredAddressFromLocationPlacemark(place: {
  formattedAddress?: string | null;
  name?: string | null;
  street?: string | null;
  streetNumber?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
}): StructuredAddress {
  const streetBase = [place.streetNumber?.trim(), place.street?.trim()].filter(Boolean).join(' ');
  const street1 = streetBase || place.name?.trim() || '';

  return normalizeStructuredAddress({
    formattedAddress:
      place.formattedAddress?.trim() ??
      formatStructuredAddress({
        street1,
        city: place.city ?? '',
        state: place.region ?? '',
        postalCode: place.postalCode ?? '',
      }),
    street1,
    city: place.city ?? '',
    state: place.region ?? '',
    postalCode: place.postalCode ?? '',
  });
}

function findComponent(
  components: GoogleAddressComponent[] | null | undefined,
  type: string
): GoogleAddressComponent | undefined {
  return components?.find((component) => component.types?.includes(type));
}
