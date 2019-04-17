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
}
