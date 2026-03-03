import React, { useState, useEffect } from 'react';

function isColourAttribute(attrName: string): boolean {
  const n = String(attrName || '').toLowerCase();
  return n.includes('colour') || n.includes('color');
}

interface ProductVariation {
  id: number;
  price: number;
  regularPrice?: number;
  salePrice?: number;
  onSale?: boolean;
  stockStatus: string;
  stockQuantity?: number;
  attributes: Record<string, string>;
  image?: string;
  displayName?: string;
}

/** WP: "Manage stock" (use stockQuantity) or "Simple" (instock/outofstock only). */
function isVariationInStock(v: ProductVariation): boolean {
  const s = String(v.stockStatus || '').toLowerCase().replace(/\s+/g, '');
  if (s === 'outofstock') return false;
  if (v.stockQuantity === undefined || v.stockQuantity === null) return true;
  return Number(v.stockQuantity) > 0;
}

function attrEq(a: string | undefined, b: string | undefined): boolean {
  return String(a || '').toLowerCase().trim() === String(b || '').toLowerCase().trim();
}

/** Resolve attribute value. variationAttributes may use "Type" while variation.attributes use pa_type, attribute_pa_type, or type/attribute_type for custom attrs. */
function getAttr(v: ProductVariation, key: string): string | undefined {
  const slug = String(key || '').toLowerCase().replace(/\s+/g, '-');
  const candidates: string[] = [key, 'attribute_' + key, slug, 'attribute_' + slug];
  if (!key.toLowerCase().startsWith('pa_')) {
    candidates.push('pa_' + slug, 'attribute_pa_' + slug);
  }
  for (const c of candidates) {
    const x = v.attributes[c];
    if (x != null && x !== '') return String(x);
  }
  return undefined;
}

export type VariationAttributeSwatches = Record<string, { type: 'color' | 'image' | 'select'; swatches: Record<string, string> }>;

interface VariationSelectorProps {
  variations: ProductVariation[];
  variationAttributes: Record<string, string[]>;
  variationAttributeSwatches?: VariationAttributeSwatches;
  onVariationSelect: (variation: ProductVariation) => void;
  onSelectionChange?: (hasAnySelection: boolean) => void;
  selectedVariation?: ProductVariation;
  disabled?: boolean;
}

/** Find swatch value (hex) for an option; API may use slug, name, or varied casing. */
function getSwatchValue(
  swatches: Record<string, string> | undefined,
  optionValue: string
): string | undefined {
  if (!swatches || typeof swatches !== 'object') return undefined;
  if (swatches[optionValue]) return swatches[optionValue];
  const lower = optionValue.toLowerCase().trim();
  if (swatches[lower]) return swatches[lower];
  const slug = lower.replace(/\s+/g, '-');
  if (swatches[slug]) return swatches[slug];
  const noSpaces = lower.replace(/\s+/g, '');
  if (swatches[noSpaces]) return swatches[noSpaces];
  const key = Object.keys(swatches).find(k => attrEq(k, optionValue));
  return key ? swatches[key] : undefined;
}

export const VariationSelector: React.FC<VariationSelectorProps> = ({
  variations,
  variationAttributes,
  variationAttributeSwatches,
  onVariationSelect,
  onSelectionChange,
  selectedVariation,
  disabled = false
}) => {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!selectedVariation) {
      setSelectedAttributes({});
      return;
    }
    if (variationAttributes) {
      const next: Record<string, string> = {};
      for (const attrName of Object.keys(variationAttributes)) {
        const val = getAttr(selectedVariation, attrName);
        if (val != null && val !== '') next[attrName] = val;
      }
      setSelectedAttributes(next);
    }
  }, [selectedVariation, variationAttributes]);

  useEffect(() => {
    onSelectionChange?.(Object.keys(selectedAttributes).length > 0);
  }, [selectedAttributes, onSelectionChange]);

  const handleAttributeChange = (attributeName: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(newAttributes);

    const matchingVariation = variations.find(variation =>
      Object.keys(newAttributes).every(attrName =>
        attrEq(getAttr(variation, attrName), newAttributes[attrName])
      )
    );

    if (matchingVariation) {
      onVariationSelect(matchingVariation);
    }
  };

  const getAvailableOptions = (attributeName: string): string[] => {
    const otherAttributes = { ...selectedAttributes };
    delete otherAttributes[attributeName];

    return variations
      .filter(variation =>
        Object.keys(otherAttributes).every(attrName =>
          attrEq(getAttr(variation, attrName), otherAttributes[attrName])
        )
      )
      .map(v => getAttr(v, attributeName))
      .filter((x): x is string => x != null && x !== '')
      .filter((value, index, array) => array.findIndex(v => attrEq(v, value)) === index);
  };

  const isOptionAvailable = (attributeName: string, value: string): boolean => {
    return getAvailableOptions(attributeName).some(opt => attrEq(opt, value));
  };

  const getMatchingVariations = (attributeName: string, value: string): ProductVariation[] => {
    const otherAttributes = { ...selectedAttributes };
    delete otherAttributes[attributeName];
    return variations.filter(v => {
      if (!attrEq(getAttr(v, attributeName), value)) return false;
      return Object.keys(otherAttributes).every(a => attrEq(getAttr(v, a), otherAttributes[a]));
    });
  };

  const getOptionStockStatus = (attributeName: string, value: string): 'instock' | 'outofstock' | 'onbackorder' => {
    const matching = getMatchingVariations(attributeName, value);
    return matching.length === 0 ? 'outofstock' : (matching.some(v => isVariationInStock(v)) ? 'instock' : 'outofstock');
  };

  /** Sum of stockQuantity for matching in-stock variations; undefined if any in-stock match has no quantity. */
  const getOptionStockQuantity = (attributeName: string, value: string): number | undefined => {
    const matching = getMatchingVariations(attributeName, value).filter(isVariationInStock);
    if (matching.length === 0) return undefined;
    const withQty = matching.filter(v => v.stockQuantity != null);
    if (withQty.length !== matching.length) return undefined;
    return withQty.reduce((sum, v) => sum + (v.stockQuantity ?? 0), 0);
  };

  if (!variations || variations.length === 0 || !variationAttributes || Object.keys(variationAttributes).length === 0) {
    return (
      <div className="text-red-600 text-sm font-bold uppercase tracking-widest">
        Failed to load options
      </div>
    );
  }

  /** Display label for attribute (e.g. pa_color → Color). */
  const attributeLabel = (name: string) =>
    name.startsWith('pa_') ? name.slice(3).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : name;

  /** Put colour attributes first for consistent swatch display with size/other variations. */
  const sortedAttributeEntries = Object.entries(variationAttributes).sort(([a], [b]) => {
    const aIsColour = /colour|color/.test(a.toLowerCase());
    const bIsColour = /colour|color/.test(b.toLowerCase());
    if (aIsColour && !bIsColour) return -1;
    if (!aIsColour && bIsColour) return 1;
    return 0;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {sortedAttributeEntries.map(([attributeName, options]) => (
        <div key={attributeName}>
          <label className="block text-sm font-bold uppercase tracking-widest mb-2 sm:mb-3">
            {attributeLabel(attributeName)}:
          </label>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {options.map(option => {
              const isAvailable = isOptionAvailable(attributeName, option);
              const stockStatus = getOptionStockStatus(attributeName, option);
              const optionStockQty = getOptionStockQuantity(attributeName, option);
              const isSelected = selectedAttributes[attributeName] === option;
              const isOutOfStock = stockStatus === 'outofstock';
              const swatchMeta = variationAttributeSwatches?.[attributeName];
              const swatchType = swatchMeta?.type;
              const swatchValue = getSwatchValue(swatchMeta?.swatches, option);
              const isColourSwatch = swatchType === 'color' || swatchType === 'image' || (isColourAttribute(attributeName) && swatchValue);

              const baseButtonClass = `inline-flex items-center justify-center font-bold uppercase tracking-widest text-xs transition-colors ${
                isSelected
                  ? isColourSwatch
                    ? 'ring-2 ring-purple-600 border-2 border-transparent'
                    : 'bg-purple-600 text-white border-2 border-black'
                  : isOutOfStock
                  ? 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-black border-2 border-zinc-200 hover:border-purple-500'
              }`;
              const title = isOutOfStock ? 'Out of stock' : isAvailable ? `Select ${option}` : 'Not available';

              const isColorSwatchOnly = (swatchType === 'color' || isColourAttribute(attributeName)) && swatchValue;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleAttributeChange(attributeName, option)}
                  disabled={disabled || !isAvailable || isOutOfStock}
                  className={(swatchType === 'color' || swatchType === 'image' || (isColourAttribute(attributeName) && swatchValue)) ? `${baseButtonClass} rounded-full w-11 h-11 sm:w-10 sm:h-10 min-w-[2.75rem] min-h-[2.75rem] sm:min-w-[2.5rem] sm:min-h-[2.5rem] p-0 touch-manipulation` : `${baseButtonClass} px-4 py-3 sm:py-2 min-h-[44px] sm:min-h-0 touch-manipulation`}
                  style={isColorSwatchOnly ? { backgroundColor: swatchValue } : undefined}
                  title={title}
                  aria-label={title}
                >
                  {isColorSwatchOnly ? (
                    <>
                      <span className="sr-only">{option}</span>
                    </>
                  ) : swatchType === 'image' && swatchValue ? (
                    <>
                      <img
                        src={swatchValue}
                        alt=""
                        className={`w-6 h-6 rounded-full object-cover shrink-0 ${isSelected ? 'border-0' : 'border border-zinc-300'}`}
                        aria-hidden
                      />
                      <span className="sr-only">{option}</span>
                    </>
                  ) : (
                    <span className="flex flex-wrap items-center justify-center gap-x-1 sm:gap-x-2">
                      {option}
                      {isOutOfStock && <span className="text-[10px] sm:text-xs">(Out of Stock)</span>}
                      {!isOutOfStock && optionStockQty != null && optionStockQty > 0 && (
                        <span className="text-[10px] sm:text-xs">({optionStockQty})</span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {isColourAttribute(attributeName) && selectedAttributes[attributeName] && (
            <p className="mt-2 text-sm text-zinc-600">
              Selected: <span className="font-semibold">{selectedAttributes[attributeName]}</span>
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
