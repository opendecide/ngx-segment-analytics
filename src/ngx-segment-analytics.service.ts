import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SEGMENT_CONFIG, WindowWrapper } from './ngx-segment-analytics.module';
import { SegmentConfig } from './ngx-segment-analytics.config';

/** @dynamic */
@Injectable()
export class SegmentService {

    /**
     * @param {WindowWrapper} w Browser window
     * @param {Document} doc Browser DOM
     * @param {SegmentConfig} config Segment configuration
     */
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

    /**
     * The identify method is how you associate your users and their actions to a recognizable userId and traits.
     *
     * @param {string} userId The database ID for the user.
     * @param {any} traits A dictionary of traits you know about the user, like their email or name
     * @param {any} options A dictionary of options.
     *
     * @returns {Promise<SegmentService>}
     */
    public identify(userId?: string, traits?: any, options?: any): Promise<SegmentService> {
        return new Promise((resolve) => {
            this.w.analytics.identify(userId, traits, options, resolve(this));
        });
    }

    /**
     * The track method lets you record any actions your users perform.
     *
     * @param {string} event The name of the event you’re tracking.
     * @param {any} properties A dictionary of properties for the event.
     * @param {any} options A dictionary of options.
     *
     * @returns {Promise<SegmentService>}
     */
    public track(event: string, properties?: any, options?: any): Promise<SegmentService> {
        return new Promise((resolve) => {
            this.w.analytics.track(event, properties, options, resolve(this));
        });
    }

    public page(name?: string, properties?: any, options?: any): Promise<SegmentService>;
    public page(category: string, name: string, properties?: any, options?: any): Promise<SegmentService>;
    /**
     * The page method lets you record page views on your website, along with optional extra information about the page being viewed.
     *
     * @param {string} category The category of the page.
     * @param {string} name The name of the page.
     * @param {any} properties A dictionary of properties of the page.
     * @param {any} options A dictionary of options.
     *
     * @returns {Promise<SegmentService>}
     */
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

    /**
     * The group method associates an identified user with a company, organization, project, workspace, team, tribe, platoon,
     * assemblage, cluster, troop, gang, party, society or any other name you came up with for the same concept.
     *
     * @param {string} groupId The Group ID to associate with the current user.
     * @param {any} traits A dictionary of traits for the group.
     *
     * @returns {Promise<SegmentService>}
     */
    public group(groupId: string, traits?: any): Promise<SegmentService> {
        return new Promise((resolve) => {
            this.w.analytics.group(groupId, traits, resolve(this));
        });
    }

    /**
     * The alias method combines two previously unassociated user identities.
     *
     * @param {string} userId The new user ID you want to associate with the user.
     * @param {string} previousId The previous ID that the user was recognized by. This defaults to the currently identified user’s ID.
     * @param {any} options A dictionary of options.
     *
     * @returns {Promise<SegmentService>}
     */
    public alias(userId: string, previousId?: string, options?: any): Promise<SegmentService> {
        return new Promise((resolve) => {
            this.w.analytics.alias(userId, previousId, options, resolve(this));
        });
    }

    /**
     * The ready method allows you execute a promise that will be called as soon as all of your enabled destinations have loaded
     * and analytics.js has completed initialization.
     *
     * @returns {Promise<SegmentService>}
     */
    public ready(): Promise<SegmentService> {
        return new Promise((resolve) => {
            this.w.analytics.ready(resolve(this));
        });
    }

    /**
     * Return information about the currently identified user
     *
     * @returns {any}
     */
    public user(): any {
        return this.w.analytics.user();
    }

    /**
     * Return identifier about the currently identified user
     *
     * @returns {string|null}
     */
    public id(): string|null {
        return this.w.analytics.id();
    }

    /**
     *
     * @returns {any}
     */
    public traits(): any {
        return this.w.analytics.traits();
    }

    /**
     * Reset the id, including anonymousId, and clear traits for the currently identified user and group.
     */
    public reset(): void {
        this.w.analytics.reset();
    }

    /**
     * Turn on/off debug mode, logging helpful messages to the console.
     *
     * @param {boolean} enabled
     */
    public debug(enabled?: boolean): void {
        this.w.analytics.debug(enabled);
    }

    /**
     * Set listeners for these events and run your own custom code.
     *
     * @param {string} method Name of the method to listen for
     * @param {(event?: string, properties?: any, options?: any) => any} callback A function to execute after each the emitted method
     */
    public on(
        method: string,
        callback: (event?: string, properties?: any, options?: any) => any
    ): void {
        this.w.analytics.on(method, callback);
    }

    /**
     * Attaches the `track` call as a handler to a link
     *
     * @param {HTMLElement | HTMLElement[]} elements DOM element or an array of DOM elements to be bound with track method.
     * @param {string | Function} event The name of the event, passed to the `track` method or a function that returns a string to be used
     *                                  as the name of the track event.
     * @param {any | Function} properties A dictionary of properties to pass with the `track` method.
     */
    public trackLink(
        elements: HTMLElement | HTMLElement[],
        event: string | Function,
        properties?: any | Function
    ): void {
        this.w.analytics.trackLink(elements, event, properties);
    }

    /**
     * Binds a `track` call to a form submission.
     *
     * @param {HTMLElement | HTMLElement[]} forms The form element to track or an array of form
     * @param {string | Function} event The name of the event, passed to the `track` method.
     * @param {any | Function} properties A dictionary of properties to pass with the `track` method.
     */
    public trackForm(
        forms: HTMLElement | HTMLElement[],
        event: string | Function,
        properties?: any | Function
    ): void {
        this.w.analytics.trackForm(forms, event, properties);
    }

    /**
     * Set the length (in milliseconds) of the callbacks and helper functions
     *
     * @param {number} timeout Number of milliseconds
     */
    public timeout(timeout: number): void {
        this.w.analytics.timeout(timeout);
    }
}
