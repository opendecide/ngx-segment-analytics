import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {SEGMENT_CONFIG, WindowWrapper} from './ngx-segment-analytics.module';
import {SegmentConfig} from './ngx-segment-analytics.config';

export interface SegmentPlugin {
    // Video Plugins
    new(player: any, accessToken: string): any;

    // Others plugins
    new(): any;
}

/** @dynamic */
@Injectable()
export class SegmentService {

    /**
     * @param w Browser window
     * @param doc Browser DOM
     * @param config Segment configuration
     */
    constructor(
        @Inject(WindowWrapper) private w: WindowWrapper,
        @Inject(DOCUMENT) private doc: Document,
        @Inject(SEGMENT_CONFIG) private config: SegmentConfig
    ) {
        if (typeof this.config.loadOnInitialization !== 'boolean') {
            this.config.loadOnInitialization = true; // Compatibility < 1.2.5
        }

        if (this.config.loadOnInitialization && (typeof this.config.apiKey === 'undefined' || this.config.apiKey === '')) {
            console.error('The API Key cannot be an empty string if Segment must be loaded on initialization.');
            return;
        }

        if (
            typeof this.w.analytics === 'undefined'
            || typeof this.w.analytics.initialize === 'undefined'
            || this.w.analytics.initialize === false
        ) {
            if (typeof this.w.analytics !== 'undefined' && this.w.analytics.invoked === true) {
                console.error('Segment snippet included twice.');
                return;
            }

            if (this.config.debug) {
                console.log('Segment initialization ...');
            }

            this.w.analytics = [];
            this.w.analytics.invoked = true;

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
                'on',
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

            const segmentHost: string = typeof this.config.segmentHost === 'string' ? this.config.segmentHost : 'cdn.segment.com';

            this.w.analytics.load = (key: string, options: { integrations: { [key: string]: boolean } }) => {
                const script = this.doc.createElement('script');
                script.type = 'text/javascript';
                script.async = true;
                script.src = 'https://' + segmentHost + '/analytics.js/v1/' + key + '/analytics.min.js';

                const first = this.doc.getElementsByTagName('script')[0];
                first.parentNode.insertBefore(script, first);
                this.w.analytics._loadOptions = options;
            };

            this.w.analytics.SNIPPET_VERSION = '4.1.0';
            if (this.config.loadOnInitialization) {
                this.load(this.config.apiKey);
            }
        }
    }

    /**
     * Load Segment configuration.
     *
     * @param apiKey Write API Key
     * @param options Optional parameters
     */
    public load(apiKey: string, options?: any): void {
        this.w.analytics.load(apiKey, options);
        if (this.config.debug) {
            console.log('Segment initialized');
        }
        this.debug(this.config.debug);
    }

    /**
     * The identify method is how you associate your users and their actions to a recognizable userId and traits.
     *
     * @param userId The database ID for the user.
     * @param traits A dictionary of traits you know about the user, like their email or name
     * @param options A dictionary of options.
     *
     * @returns
     */
    public identify(userId?: string, traits?: any, options?: any): Promise<SegmentService> {
        return new Promise((resolve) => {
            this.w.analytics.identify(userId, traits, options, _ => resolve(this));
        });
    }

    /**
     * The track method lets you record any actions your users perform.
     *
     * @param event The name of the event you’re tracking.
     * @param properties A dictionary of properties for the event.
     * @param options A dictionary of options.
     *
     * @returns
     */
    public track(event: string, properties?: any, options?: any): Promise<SegmentService> {
        return new Promise((resolve) => {
            this.w.analytics.track(event, properties, options, _ => resolve(this));
        });
    }

    /**
     * The page method lets you record page views on your website, along with optional extra information about the page being viewed.
     *
     * @param name The name of the page.
     * @param properties A dictionary of properties of the page.
     * @param options A dictionary of options.
     *
     * @returns
     */
    public page(name?: string, properties?: any, options?: any): Promise<SegmentService>;

    /**
     * The page method lets you record page views on your website, along with optional extra information about the page being viewed.
     *
     * @param category The category of the page.
     * @param name The name of the page.
     * @param properties A dictionary of properties of the page.
     * @param options A dictionary of options.
     *
     * @returns
     */
    public page(category: string, name: string, properties?: any, options?: any): Promise<SegmentService>;

    /**
     * The page method lets you record page views on your website, along with optional extra information about the page being viewed.
     *
     * @param category The category of the page.
     * @param name The name of the page.
     * @param properties A dictionary of properties of the page.
     * @param options A dictionary of options.
     *
     * @returns
     */
    public page(category?: string, name?: string, properties?: any, options?: any): Promise<SegmentService> {
        return new Promise((resolve) => {
            this.w.analytics.page(category, name, properties, options, _ => resolve(this));
        });
    }

    /**
     * The group method associates an identified user with a company, organization, project, workspace, team, tribe, platoon,
     * assemblage, cluster, troop, gang, party, society or any other name you came up with for the same concept.
     *
     * @param groupId The Group ID to associate with the current user.
     * @param traits A dictionary of traits for the group.
     *
     * @returns
     */
    public group(groupId: string, traits?: any): Promise<SegmentService> {
        return new Promise((resolve) => {
            this.w.analytics.group(groupId, traits, _ => resolve(this));
        });
    }

    /**
     * The alias method combines two previously unassociated user identities.
     *
     * @param userId The new user ID you want to associate with the user.
     * @param previousId The previous ID that the user was recognized by. This defaults to the currently identified user’s ID.
     * @param options A dictionary of options.
     *
     * @returns
     */
    public alias(userId: string, previousId?: string, options?: any): Promise<SegmentService> {
        return new Promise((resolve) => {
            this.w.analytics.alias(userId, previousId, options, _ => resolve(this));
        });
    }

    /**
     * The ready method allows you execute a promise that will be called as soon as all of your enabled destinations have loaded
     * and analytics.js has completed initialization.
     *
     * @returns
     */
    public ready(): Promise<SegmentService> {
        return new Promise((resolve) => {
            this.w.analytics.ready(_ => resolve(this));
        });
    }

    /**
     * Return informations about the currently identified user
     *
     * @returns Informations about the currently identified user
     */
    public user(): any {
        return this.w.analytics.user();
    }

    /**
     * Return identifier about the currently identified user
     *
     * @returns Identifier about the currently identified user
     */
    public id(): string | null {
        return this.w.analytics.id();
    }

    /**
     * Return traits about the currently identified user
     *
     * @returns Traits about the currently identified user
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
     * @param enabled Enable or not the debug mode
     */
    public debug(enabled?: boolean): void {
        this.w.analytics.debug(enabled);
    }

    /**
     * Set listeners for these events and run your own custom code.
     *
     * @param method Name of the method to listen for
     * @param callback A function to execute after each the emitted method
     */
    public on(method: string, callback: (event?: string, properties?: any, options?: any) => any): void {
        this.w.analytics.on(method, callback);
    }

    /**
     * Attaches the `track` call as a handler to a link
     *
     * @param elements DOM element or an array of DOM elements to be bound with track method.
     * @param event The name of the event, passed to the `track` method or a function that returns a string to be used
     *              as the name of the track event.
     * @param properties A dictionary of properties to pass with the `track` method.
     */
    public trackLink(elements: HTMLElement | HTMLElement[], event: string | Function, properties?: any | Function): void {
        this.w.analytics.trackLink(elements, event, properties);
    }

    /**
     * Binds a `track` call to a form submission.
     *
     * @param forms The form element to track or an array of form
     * @param event The name of the event, passed to the `track` method.
     * @param properties A dictionary of properties to pass with the `track` method.
     */
    public trackForm(forms: HTMLElement | HTMLElement[], event: string | Function, properties?: any | Function): void {
        this.w.analytics.trackForm(forms, event, properties);
    }

    /**
     * Set the length (in milliseconds) of the callbacks and helper functions
     *
     * @param timeout Number of milliseconds
     */
    public timeout(timeout: number): void {
        this.w.analytics.timeout(timeout);
    }

    public get plugins(): { [pluginName: string]: SegmentPlugin } {
        return this.w.analytics.plugins;
    }
}
