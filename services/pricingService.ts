
import type { ProductListing, PricingSuggestion } from '../types';

// These are simplified heuristics and would be replaced by more robust models
// or database lookups in a production environment.
const MATERIAL_FACTORS: Record<string, number> = {
  'terracotta': 50,
  'clay': 50,
  'wood': 100,
  'metal': 150,
  'brass': 180,
  'textile': 70,
  'cotton': 70,
  'silk': 200,
};

const HOURLY_WAGE_INR = 120; // Artisan's hourly wage in INR

/**
 * Extracts the first numerical value from a dimension string.
 * e.g., "6-inch diameter" -> 6
 * e.g., "12cm x 15cm" -> 12
 * @param dimensions The dimension string from the product attributes.
 * @returns A number representing a key dimension, or a default value.
 */
function getDominantSize(dimensions: string): number {
    const matches = dimensions.match(/(\d+(\.\d+)?)/);
    return matches ? parseFloat(matches[1]) : 5; // Default size of 5 if no number found
}


/**
 * Calculates a suggested price for a product based on its attributes.
 * @param attributes The product attributes extracted by the AI.
 * @returns A PricingSuggestion object.
 */
export function calculatePriceSuggestion(attributes: ProductListing['attributes']): PricingSuggestion {
    const { timeToMakeHrs, material, dimensions } = attributes;

    const lowerCaseMaterial = material.toLowerCase();
    const material_factor = MATERIAL_FACTORS[lowerCaseMaterial] || 100; // Default factor

    const dominantSize = getDominantSize(dimensions);
    const size_factor = dominantSize * 10; // Simple size factor

    // Rule fallback: base = (timeToMakeHrs * 120) + material_factor + size_factor
    const base = (timeToMakeHrs * HOURLY_WAGE_INR) + material_factor + size_factor;

    // minAcceptable = round(base * 0.9)
    const minAcceptable = Math.round(base * 0.9);

    // aiSuggested = round((historicAvg || base) * locality_factor)
    // Mocking locality_factor and using base as we don't have historical averages yet.
    const locality_factor = 1.1; // 10% market adjustment
    const aiSuggested = Math.round(base * locality_factor);

    const reasoning = `Calculated based on ~${timeToMakeHrs} hours of work, cost of ${material}, product size, and a standard market adjustment.`;

    return { aiSuggested, minAcceptable, reasoning };
}