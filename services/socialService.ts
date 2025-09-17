import type { ProductListing } from '../types';

type PublishChannel = 'Instagram' | 'ONDC';

interface PublishResult {
    success: boolean;
    message: string;
    channel: PublishChannel;
}

/**
 * Mocks publishing a product listing to Instagram Shop.
 * In a real application, this would interact with the Instagram Graph API.
 * @param listing The product listing to be published.
 * @returns A promise that resolves with the result of the publish attempt.
 */
export async function publishToInstagram(listing: ProductListing): Promise<PublishResult> {
    console.log('Simulating publish to Instagram for:', listing.title);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate a potential failure rate (e.g., 10% chance of failure)
    if (Math.random() < 0.1) {
        console.error('Mock Instagram API Error: Failed to publish.');
        return {
            success: false,
            message: 'A mock API error occurred. Please try again.',
            channel: 'Instagram',
        };
    }

    console.log('Successfully published to Instagram.');
    return {
        success: true,
        message: 'Product was successfully published to your Instagram Shop!',
        channel: 'Instagram',
    };
}

/**
 * Mocks publishing a product listing to the ONDC network.
 * In a real application, this would interact with an ONDC seller-side adapter.
 * @param listing The product listing to be published.
 * @returns A promise that resolves with the result of the publish attempt.
 */
export async function publishToONDC(listing: ProductListing): Promise<PublishResult> {
    console.log('Simulating publish to ONDC for:', listing.title);

    // Simulate a longer network delay for a different service
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Simulate a potential failure rate with a specific error message
    if (Math.random() < 0.15) { 
        console.error('Mock ONDC API Error: Invalid category mapping.');
        return {
            success: false,
            message: 'ONDC publish failed: Invalid category mapping.',
            channel: 'ONDC',
        };
    }

    console.log('Successfully published to ONDC.');
    return {
        success: true,
        message: 'Product was successfully listed on the ONDC network!',
        channel: 'ONDC',
    };
}
