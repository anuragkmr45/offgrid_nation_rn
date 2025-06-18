export function validateTitle(value: string): string | null {
  if (!value || value.trim().length === 0) {
    return 'Title is required';
  }
  return null;
}

export function validatePrice(value: string): string | null {
  if (!value || value.trim().length === 0) {
    return 'Price is required';
  }
  const numeric = value.trim().replace(/[^0-9.]/g, '');
  if (!numeric || isNaN(Number(numeric))) {
    return 'Price must be a valid number';
  }
  return null;
}

export function validateDescription(value: string): string | null {
  if (!value || value.trim().length === 0) {
    return 'Description is required';
  }
  if (value.length > 400) {
    return 'Description cannot exceed 400 characters';
  }
  return null;
}

export function validateLocation(value: string): string | null {
  if (!value || value.trim().length === 0) {
    return 'Location is required';
  }
  return null;
}

export interface MarketplaceFormState {
  title: string;
  price: string;
  description: string;
  location: string;
  hasImages: boolean;
  hasCategory: boolean;
  hasCondition: boolean;
  hasLatLng: boolean;
}

export function canSubmitMarketplace(
  state: MarketplaceFormState
): boolean {
  return (
    validateTitle(state.title) === null &&
    validatePrice(state.price) === null &&
    validateDescription(state.description) === null &&
    validateLocation(state.location) === null &&
    state.hasImages &&
    state.hasCategory &&
    state.hasCondition &&
    state.hasLatLng
  );
}