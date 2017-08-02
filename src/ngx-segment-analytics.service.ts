import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {SEGMENT_CONFIG, WindowWrapper} from './ngx-segment-analytics.module';
import { SegmentConfig } from './ngx-segment-analytics.config';

@Injectable()
export class SegmentService {

    constructor(
        @Inject(WindowWrapper) private w: WindowWrapper,
        @Inject(DOCUMENT) private doc: Document,
        @Inject(SEGMENT_CONFIG) private config: SegmentConfig
    ) {
        if (
            typeof this.w.analytics === 'undefined'
            || typeof this.w.analytics.initialize === 'undefined'
            || this.w.analytics.initialize === false
        ) {
            if (this.config.debug) {
                console.log('Segment initialization ...');
            }

            this.w.analytics = [];

            this.w.analytics.methods = [
                'trackSubmit',
                'trackClick',
                'trackLink',
                'trackForm',
                'pageview',
                'identify',
                'reset',
                'group',
                'track',
                'ready',
                'alias',
                'debug',
                'page',
                'once',
                'off',
                'on'
            ];

            this.w.analytics.factory = (method: string) => {
                return (...args) => {
                    args.unshift(method);
                    this.w.analytics.push(args);
                    return this.w.analytics;
                };
            };

            this.w.analytics.methods.forEach((method: string) => {
                this.w.analytics[method] = this.w.analytics.factory(method);
            });

            this.w.analytics.load = (key: string) => {
                const script = this.doc.createElement('script');
                script.type = 'text/javascript';
                script.async = true;
                script.src = ('https:' === this.doc.location.protocol
                        ? 'https://' : 'http://')
                    + 'cdn.segment.com/analytics.js/v1/'
                    + key + '/analytics.min.js';

                const first = this.doc.getElementsByTagName('script')[0];
                first.parentNode.insertBefore(script, first);
            };

            this.w.analytics.SNIPPET_VERSION = '4.0.0';
            this.w.analytics.load(this.config.apiKey);
            if (this.config.debug) {
                console.log('Segment initialized');
            }
            this.debug(this.config.debug);
        }
    }

    public identify(userId?: string, traits?: any, options?: any): Promise<SegmentService> {
        return new Promise((resolve) => {
            this.w.analytics.identify(userId, traits, options, resolve(this));
        });
    }

    public track(event: string, properties?: any, options?: any): Promise<SegmentService> {
        return new Promise((resolve) => {
            this.w.analytics.track(event, properties, options, resolve(this));
        });
    }

    public page(
        category?: string,
        name?: string,
        properties?: any,
        options?: any
    ): Promise<SegmentService> {
        return new Promise((resolve) => {
            this.w.analytics.page(category, name, properties, options, resolve(this));
        });
    }

    public group(groupId: string, traits?: any): Promise<SegmentService> {
        return new Promise((resolve) => {
            this.w.analytics.group(groupId, traits, resolve(this));
        });
    }

    public alias(userId: string, previousId?: string, options?: any): Promise<SegmentService> {
        return new Promise((resolve) => {
            this.w.analytics.alias(userId, previousId, options, resolve(this));
        });
    }

    public ready(): Promise<SegmentService> {
        return new Promise((resolve) => {
            this.w.analytics.ready(resolve(this));
        });
    }

    public user(): any {
        return this.w.analytics.user();
    }

    public id(): any {
        return this.w.analytics.id();
    }

    public traits(): any {
        return this.w.analytics.traits();
    }

    public reset(): void {
        this.w.analytics.reset();
    }

    public debug(enabled?: boolean): void {
        this.w.analytics.debug(enabled);
    }

    public on(
        method: string,
        callback: (event?: string, properties?: any, options?: any) => any
    ): void {
        this.w.analytics.on(method, callback);
    }

    public trackLink(
        elements: HTMLElement | HTMLElement[],
        event: string | Function,
        properties?: any | Function
    ): void {
        this.w.analytics.trackLink(elements, event, properties);
    }

    public trackForm(
        forms: HTMLElement | HTMLElement[],
        event: string | Function,
        properties?: any | Function
    ): void {
        this.w.analytics.trackForm(forms, event, properties);
    }

    public timeout(timeout: number): void {
        this.w.analytics.timeout(timeout);
    }
}
