import {InjectionToken} from '@angular/core';

/**
 * Segment Configuration Interface
 */
export interface SegmentConfig {
    /** API Key for Segment.io */
    apiKey?: string;
    /** Debug mode status */
    debug?: boolean;
    /** Load Segment configuration on initialization */
    loadOnInitialization?: boolean;
    /** Segment Host if requests are proxied **/
    segmentHost?: string;
    /** Segment Custom URI **/
    segmentUri?: string;
}

/** Segment Configuration Injection Token */
export const SEGMENT_CONFIG: InjectionToken<SegmentConfig> = new InjectionToken<SegmentConfig>('ngx-segment-analytics.config');

export const DEFAULT_CONFIG: SegmentConfig = {
    debug: false,
    loadOnInitialization: true, // Compatibility < 1.2.5
    segmentHost: 'cdn.segment.com',
    segmentUri: '/analytics.js/v1/$API_KEY$/analytics.min.js',
};
