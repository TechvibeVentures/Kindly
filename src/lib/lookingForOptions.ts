export type LookingForOption = {
  value: string;
  label: string;
  description: string;
};

/** Stored in `profiles.looking_for` (TEXT[]). Order = onboarding display order. */
export const LOOKING_FOR_OPTIONS: LookingForOption[] = [
  { value: 'co-parenting', label: 'Co-parenting', description: 'Create and raise a child together' },
  { value: 'sperm-donation', label: 'Sperm donation', description: 'Biological contribution only' },
  { value: 'co-care', label: 'Co-care', description: 'Support existing children' },
  { value: 'relationship', label: 'Relationship', description: 'Find a romantic partner' },
];

/** Legacy slugs still in the database → current canonical value (for matching & filters). */
const LEGACY_TO_CANONICAL: Record<string, string> = {
  'joint-custody': 'co-parenting',
  'classic-relationship': 'relationship',
};

const LABEL_BY_VALUE: Record<string, string> = Object.fromEntries(
  LOOKING_FOR_OPTIONS.map((o) => [o.value, o.label])
);
LABEL_BY_VALUE['joint-custody'] = 'Co-parenting';
LABEL_BY_VALUE['classic-relationship'] = 'Relationship';

export function normalizeLookingForValue(value: string): string {
  return LEGACY_TO_CANONICAL[value] ?? value;
}

export function getLookingForLabel(value: string): string {
  return LABEL_BY_VALUE[value] ?? value.replace(/-/g, ' ');
}

export function formatLookingForDisplay(values: string[] | null | undefined): string {
  if (!values?.length) return '';
  return values.map(getLookingForLabel).join(', ');
}

/** For filter chips: value + label only */
export function lookingForFilterOptions(): { value: string; label: string }[] {
  return LOOKING_FOR_OPTIONS.map(({ value, label }) => ({ value, label }));
}
