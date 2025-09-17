import type { ProductListing } from '../types';

type EventName = 'listing_created' | 'photoshoot_created' | 'checkout_initiated' | 'payment_captured' | 'ondc_published' | 'insta_published';

interface EventPayload {
    [key: string]: any;
}

/**
 * Mocks logging an analytics event to a backend service like BigQuery.
 * In a real application, this would send an HTTP request to a logging endpoint.
 * @param eventName The name of the event to log.
 * @param payload The data associated with the event.
 */
export function logEvent(eventName: EventName, payload: EventPayload): void {
    const timestamp = new Date().toISOString();
    console.log(
        `[ANALYTICS EVENT]
         Event Name: ${eventName}
         Timestamp: ${timestamp}
         Payload: ${JSON.stringify(payload, null, 2)}
        `
    );
}
