import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../services/helpers';

/** Option shape from API: {value, price?} or {value, label?, price?} or plain string */
export type ProductAddonOption = string | { value?: string; label?: string; price?: number };

export type ProductAddon = {
  id: string;
  name: string;
  label: string;
  type: string;
  required?: boolean;
  price: number;
  price_group?: string;
  price_type?: string;
  options?: ProductAddonOption[];
  placeholder?: string;
};

/** Form values keyed by addon id. Text = string, file = File or URL string after upload. */
export type AddonValues = Record<string, string | File | undefined>;

interface ProductCustomisationFieldsProps {
  addons: ProductAddon[];
  profileName?: string;
  values: AddonValues;
  onChange: (values: AddonValues) => void;
  disabled?: boolean;
}

function getAddonValue(addon: ProductAddon, values: AddonValues): string | File | undefined {
  return values[addon.id];
}

/** Normalize option to display label: API sends {value, price} or {value, label, price}; use value when no label. */
function getOptDisplay(o: ProductAddonOption): string {
  if (o == null) return '';
  if (typeof o === 'string') return o;
  return String((o as { label?: string; value?: string }).label ?? (o as { value?: string }).value ?? '');
}

/** Normalize option to form value (for storage and matching). */
function getOptValue(o: ProductAddonOption): string {
  if (o == null) return '';
  if (typeof o === 'string') return o;
  return String((o as { value?: string }).value ?? (o as { label?: string }).label ?? '');
}

/** Get per-option price if present (for radio/select with option-level pricing). */
function getOptPrice(o: ProductAddonOption): number | undefined {
  if (o == null || typeof o === 'string') return undefined;
  const p = (o as { price?: number }).price;
  return typeof p === 'number' ? p : undefined;
}

function isAddonPopulated(addon: ProductAddon, values: AddonValues): boolean {
  const v = getAddonValue(addon, values);
  if (v == null) return false;
  if (typeof v === 'string') return v.trim() !== '';
  return true; // File
}

/**
 * Get effective price for an addon (handles per-option pricing for radio/select).
 */
function getAddonEffectivePrice(addon: ProductAddon, values: AddonValues): number {
  const val = getAddonValue(addon, values);
  if (addon.type === 'radio' || addon.type === 'select') {
    const opts = addon.options ?? [];
    const selectedVal = typeof val === 'string' ? val : '';
    for (const o of opts) {
      if (getOptValue(o) === selectedVal) {
        const optPrice = getOptPrice(o);
        if (typeof optPrice === 'number') return Math.max(0, optPrice);
        break;
      }
    }
  }
  return addon.price ?? 0;
}

/**
 * When an image is uploaded, radio addons become required.
 * Returns false if any image addon is populated but any radio addon is not.
 */
export function isCustomisationValid(addons: ProductAddon[], values: AddonValues): boolean {
  const hasImage = addons.some((a) => {
    const isFile = a.type === 'file' || a.type === 'file_upload' || a.type === 'image_upload';
    return isFile && isAddonPopulated(a, values);
  });
  if (!hasImage) return true;

  const radioAddons = addons.filter((a) => (a.type === 'radio' || a.type === 'select') && (a.options ?? []).length > 0);
  return radioAddons.every((a) => isAddonPopulated(a, values));
}

/**
 * Calculate addon fee using price groups.
 * Addons in the same price_group share one fee – pay once per group if any addon in that group is populated.
 * For radio/select with per-option prices, uses the selected option's price.
 */
export function calculateAddonFee(addons: ProductAddon[], values: AddonValues): number {
  const groups = new Map<string, ProductAddon[]>();
  for (const a of addons) {
    const key = a.price_group ?? `_solo_${a.id}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(a);
  }
  let fee = 0;
  for (const groupAddons of groups.values()) {
    const hasAny = groupAddons.some(a => isAddonPopulated(a, values));
    if (!hasAny) continue;
    const groupPrice = Math.max(0, ...groupAddons.map(a => getAddonEffectivePrice(a, values)));
    fee += groupPrice;
  }
  return fee;
}

/** Renders dynamic customisation fields for any profile (text + file addons). */
export const ProductCustomisationFields: React.FC<ProductCustomisationFieldsProps> = ({
  addons,
  profileName,
  values,
  onChange,
  disabled = false,
}) => {
  const isFirstInPriceGroup = (addon: ProductAddon): boolean => {
    if (!addon.price_group) return true;
    const groupAddons = addons.filter(a => a.price_group === addon.price_group);
    return groupAddons[0]?.id === addon.id;
  };

  const getPriceHint = (addon: ProductAddon, effectivePrice?: number): string => {
    // For radio/select with per-option prices, only show price after user selects (don't show addon.price when nothing selected)
    const hasPerOptionPrices = (addon.type === 'radio' || addon.type === 'select') &&
      (addon.options ?? []).some(o => typeof o === 'object' && o != null && typeof (o as { price?: number }).price === 'number');
    if (hasPerOptionPrices && !isAddonPopulated(addon, values)) return '';

    const price = effectivePrice ?? getAddonEffectivePrice(addon, values);
    if (price <= 0) return '';
    if (addon.price_group && !isFirstInPriceGroup(addon)) return ' (included)';
    return ` (+${formatPrice(price)})`;
  };

  const setAddonValue = (addonId: string, value: string | File | undefined) => {
    onChange({ ...values, [addonId]: value });
  };

  if (!addons?.length) return null;

  const hasAnyImageUploaded = addons.some((a) => {
    const isFile = a.type === 'file' || a.type === 'file_upload' || a.type === 'image_upload';
    return isFile && isAddonPopulated(a, values);
  });

  const sectionTitle = profileName ? `${profileName} (optional)` : 'Customisation (optional)';

  return (
    <div className="mb-4 sm:mb-6">
      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-500 mb-3 sm:mb-4">{sectionTitle}</h3>
      <div className="space-y-3 sm:space-y-4">
        {addons.map((addon) => {
          const value = getAddonValue(addon, values);
          const isFile = addon.type === 'file' || addon.type === 'file_upload' || addon.type === 'image_upload';
          const isRadioOrSelect = (addon.type === 'radio' || addon.type === 'select') && addon.options && addon.options.length > 0;

          if (isRadioOrSelect && !hasAnyImageUploaded) return null;

          if (isRadioOrSelect) {
            const opts = (addon.options ?? []) as ProductAddonOption[];

            if (addon.type === 'select') {
              return (
                <div key={addon.id}>
                  <label htmlFor={`addon-${addon.id}`} className="block font-bold uppercase tracking-widest text-sm mb-2">
                    {addon.label}
                    <span className="text-zinc-500 font-normal normal-case ml-2">{getPriceHint(addon)}</span>
                  </label>
                  <select
                    id={`addon-${addon.id}`}
                    value={typeof value === 'string' ? value : ''}
                    onChange={(e) => setAddonValue(addon.id, e.target.value || undefined)}
                    disabled={disabled}
                    className="w-full border border-zinc-200 px-4 py-3 font-medium text-base sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent touch-manipulation"
                  >
                    <option value="">Select...</option>
                    {opts.map((o, i) => (
                      <option key={i} value={getOptValue(o)}>{getOptDisplay(o)}</option>
                    ))}
                  </select>
                </div>
              );
            }

            return (
              <fieldset key={addon.id} aria-required={hasAnyImageUploaded}>
                <legend className="block font-bold uppercase tracking-widest text-sm mb-2">
                  {addon.label}
                  {hasAnyImageUploaded && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
                  <span className="text-zinc-500 font-normal normal-case ml-2">{getPriceHint(addon)}</span>
                </legend>
                <div className="space-y-2">
                  {opts.map((o, i) => {
                    const optVal = getOptValue(o);
                    const optLabel = getOptDisplay(o);
                    const checked = typeof value === 'string' ? value === optVal : false;
                    return (
                      <label key={i} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`addon-${addon.id}`}
                          value={optVal}
                          checked={checked}
                          onChange={() => setAddonValue(addon.id, optVal)}
                          disabled={disabled}
                          className="w-4 h-4 text-purple-600 border-zinc-300 focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium">{optLabel}</span>
                      </label>
                    );
                  })}
                </div>
                {typeof value === 'string' && value.toLowerCase() === 'no' && (
                  <p className="mt-3 text-xs text-zinc-600 bg-zinc-50 border border-zinc-200 px-3 py-2 rounded">
                    Customers must pay a once-off image digitisation fee. Once paid, we keep your file stored with us for your next order. See our{' '}
                    <Link to="/returns-policy" className="text-purple-600 hover:text-purple-700 underline underline-offset-1 font-medium">
                      Returns Policy
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy-policy" className="text-purple-600 hover:text-purple-700 underline underline-offset-1 font-medium">
                      Privacy Policy
                    </Link>
                    {' '}for details.
                  </p>
                )}
              </fieldset>
            );
          }

          if (isFile) {
            return (
              <div key={addon.id}>
                <label htmlFor={`addon-${addon.id}`} className="block font-bold uppercase tracking-widest text-sm mb-2">
                  {addon.label}
                  <span className="text-zinc-500 font-normal normal-case ml-2">{getPriceHint(addon)}</span>
                </label>
                {value ? (
                  <div className="flex items-center gap-2 border border-zinc-200 px-4 py-3 bg-zinc-50">
                    <p className="text-sm text-zinc-700 flex-1 truncate font-medium">
                      {value instanceof File ? value.name : 'Image uploaded'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setAddonValue(addon.id, undefined)}
                      disabled={disabled}
                      className="text-xs font-bold uppercase tracking-widest text-red-600 hover:text-red-700 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <input
                    id={`addon-${addon.id}`}
                    type="file"
                    accept=".png,image/png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setAddonValue(addon.id, file || undefined);
                    }}
                    disabled={disabled}
                    className="w-full border border-zinc-200 px-4 py-3 text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:font-bold file:uppercase file:tracking-widest file:text-sm file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent touch-manipulation"
                  />
                )}
              </div>
            );
          }

          return (
            <div key={addon.id}>
              <label htmlFor={`addon-${addon.id}`} className="block font-bold uppercase tracking-widest text-sm mb-2">
                {addon.label}
                <span className="text-zinc-500 font-normal normal-case ml-2">{getPriceHint(addon)}</span>
              </label>
              <input
                id={`addon-${addon.id}`}
                type="text"
                value={typeof value === 'string' ? value : ''}
                onChange={(e) => setAddonValue(addon.id, e.target.value || undefined)}
                disabled={disabled}
                placeholder={addon.placeholder || `e.g. ${addon.label.toLowerCase()}`}
                className="w-full border border-zinc-200 px-4 py-3 font-medium text-base sm:text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent touch-manipulation"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Legacy aliases for backwards compatibility during migration
export type ScrubAddon = ProductAddon;
export type ScrubValues = AddonValues;
export const ScrubCustomisationFields = ProductCustomisationFields;
export const calculateScrubAddonFee = calculateAddonFee;
