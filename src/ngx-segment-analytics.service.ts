import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { SEGMENT_CONFIG } from './ngx-segment-analytics.module';
import { SegmentConfig } from './ngx-segment-analytics.config';

@Injectable()
export class SegmentService {

  private analytics: any;

  constructor(
      @Inject(Window) private w: any,
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

      this.analytics = this.w.analytics = [];
      this.analytics.methods = [
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

      this.analytics.factory = (method: string) => {
        return (...args) => {
          args.unshift(method);
          this.analytics.push(args);
          return this.analytics;
        };
      };

      this.analytics.methods.forEach((method: string) => {
        this.analytics[method] = this.analytics.factory(method);
      });

      this.analytics.load = (key: string) => {
        let script = this.doc.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = ('https:' === this.doc.location.protocol
                ? 'https://' : 'http://')
            + 'cdn.segment.com/analytics.js/v1/'
            + key + '/analytics.min.js';

        let first = this.doc.getElementsByTagName('script')[0];
        first.parentNode.insertBefore(script, first);
      };

      this.analytics.SNIPPET_VERSION = '4.0.0';
      this.analytics.load(this.config.apiKey);
      if (this.config.debug) {
        console.log('Segment initialized');
      }
    } else {
      this.analytics = this.w.analytics;
    }
  }

  identify(userId?: string, traits?: any, options?: any): Promise<SegmentService> {
    return new Promise((resolve) => {
      this.analytics.identify(userId, traits, options);
      resolve(this);
    });
  }

  track(event: string, properties?: any, options?: any): Promise<SegmentService> {
    return new Promise((resolve) => {
      this.analytics.track(event, properties, options);
      resolve(this);
    });
  }

  page(category?: string, name?: string, properties?: any, options?: any): Promise<SegmentService> {
    return new Promise((resolve) => {
      this.analytics.page(category, name, properties, options);
      resolve(this);
    });
  }

  group(groupId: string, traits?: any): Promise<SegmentService> {
    return new Promise((resolve) => {
      this.analytics.group(groupId, traits);
      resolve(this);
    });
  }

  alias(userId: string, previousId?: string, options?: any): Promise<SegmentService> {
    return new Promise((resolve) => {
      this.analytics.alias(userId, previousId, options);
      resolve(this);
    });
  }

  ready(): Promise<SegmentService> {
    return new Promise((resolve) => {
      this.analytics.ready();
      resolve(this);
    });
  }

  user(): any {
    return this.analytics.user();
  }

  id(): any {
    return this.analytics.id();
  }

  traits(): any {
    return this.analytics.traits();
  }

  reset(): void {
    this.analytics.reset();
  }

  debug(enabled?: boolean): void {
    this.analytics.debug(enabled);
  }

  on(method: string, callback: (event?: string, properties?: any, options?: any) => any): void {
    this.analytics.on(method, callback);
  }

  trackLink(elements: HTMLElement | HTMLElement[], event: string | Function, properties?: Object | Function): void {
    this.analytics.trackLink(elements, event, properties);
  }

  trackForm(forms: HTMLElement | HTMLElement[], event: string | Function, properties?: Object | Function): void {
    this.analytics.trackForm(forms, event, properties);
  }

  timeout(timeout: number): void {
    this.analytics.timeout(timeout);
  }
}
