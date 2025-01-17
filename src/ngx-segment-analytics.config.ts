import {InjectionToken} from '@angular/core';
import type {Plugin} from '@segment/analytics-next';

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
    /**
     * Segment Host if requests are proxied
     * @deprecated Use cdnURL instead.
     **/
    segmentHost?: string;
    /**
     *  Segment Custom URI
     *  @deprecated Use cdnURL instead.
     **/
    segmentUri?: string;
    /** CDN host if requests are proxied */
    cdnURL?: string;
    /** Plugins **/
    plugins?: Plugin[];
}

/** Segment Configuration Injection Token */
export const SEGMENT_CONFIG: InjectionToken<SegmentConfig> = new InjectionToken<SegmentConfig>('ngx-segment-analytics.config');

export const DEFAULT_CONFIG: SegmentConfig = {
    debug: false,
    loadOnInitialization: true, // Compatibility < 1.2.5
    cdnURL: 'https://cdn.segment.com',
    segmentUri: '/analytics.js/v1/$API_KEY$/analytics.min.js',
    plugins: [],
};
