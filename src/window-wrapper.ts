import {Injectable} from '@angular/core';
import type { AnalyticsSnippet } from "@segment/analytics-next";

/**
 * Window Wrapper for Angular AOT
 */
@Injectable()
export class WindowWrapper {
    /** Segment Analytics.js instance */
    public analytics: AnalyticsSnippet;
}
