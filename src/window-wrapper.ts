import {Injectable} from '@angular/core';

/**
 * Window Wrapper for Angular AOT
 */
@Injectable()
export class WindowWrapper {
    /** Segment Analytics.js instance */
    public analytics: any;
}
