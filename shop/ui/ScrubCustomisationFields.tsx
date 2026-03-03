import React from 'react';
import { formatPrice } from '../../services/helpers';

export type ProductAddon = {
  id: string;
  name: string;
  label: string;
  type: string;
  required?: boolean;
  price: number;
  price_group?: string;
  price_type?: string;
  options?: any[];
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

function isAddonPopulated(addon: ProductAddon, values: AddonValues): boolean {
  const v = getAddonValue(addon, values);
  if (v == null) return false;
  if (typeof v === 'string') return v.trim() !== '';
  return true; // File
}

/**
 * Calculate addon fee using price groups.
 * Addons in the same price_group share one fee – pay once per group if any addon in that group is populated.
 * Addons without a price_group (or in their own group) charge their price when populated.
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
    const groupPrice = Math.max(0, ...groupAddons.map(a => a.price ?? 0));
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

  const getPriceHint = (addon: ProductAddon): string => {
    if (addon.price <= 0) return '';
    if (addon.price_group && !isFirstInPriceGroup(addon)) return ' (included)';
    return ` (+${formatPrice(addon.price)})`;
  };

  const setAddonValue = (addonId: string, value: string | File | undefined) => {
    onChange({ ...values, [addonId]: value });
  };

  if (!addons?.length) return null;

  const sectionTitle = profileName ? `${profileName} (optional)` : 'Customisation (optional)';

  return (
    <div className="mb-4 sm:mb-6">
      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-500 mb-3 sm:mb-4">{sectionTitle}</h3>
      <div className="space-y-3 sm:space-y-4">
        {addons.map((addon) => {
          const value = getAddonValue(addon, values);
          const isFile = addon.type === 'file' || addon.type === 'file_upload' || addon.type === 'image_upload';

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
