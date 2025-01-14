import {Inject, Injectable} from '@angular/core';
import {DEFAULT_CONFIG, SEGMENT_CONFIG, SegmentConfig} from './ngx-segment-analytics.config';
import {AnalyticsBrowser} from '@segment/analytics-next';
import type {User, AnalyticsBrowserSettings, Analytics, InitOptions, Plugin as NewSegmentPlugin} from '@segment/analytics-next';

export interface SegmentPlugin {
    // Video Plugins
    new(player: any, accessToken: string): any;

    // Others plugins
    new(): any;
}

export type SegmentNextMiddleware = (payload: any) => void;
export type SourceMiddleware = ({integrations, payload, next}: {
    integrations: { [key: string]: any },
    payload: any,
    next: SegmentNextMiddleware,
}) => void;
export type DestinationMiddleware = ({integration, payload, next}: {
    integration: string,
    payload: any,
    next: SegmentNextMiddleware,
}) => void;


@Injectable({
    providedIn: 'root',
})
export class SegmentService {

    protected readonly _config: SegmentConfig;
    protected static readonly _segmentInstance: AnalyticsBrowser = new AnalyticsBrowser();

    /**
     * @param userConfig Segment configuration
     */
    constructor(
        @Inject(SEGMENT_CONFIG) userConfig: SegmentConfig
    ) {
        this._config = {...DEFAULT_CONFIG, ...userConfig};

        if (this._config.loadOnInitialization && (typeof this._config.apiKey === 'undefined' || this._config.apiKey === '')) {
            console.error('The API Key cannot be an empty string if Segment must be loaded on initialization.');
            return;
        }

        if (true === this._config.debug) {
            console.log('Segment initialization...');
        }

        if (this._config.loadOnInitialization && !SegmentService._segmentInstance.instance?.initialized) {
            let cdnUrl: string | undefined;
            
            if (this._config.segmentHost) {
                // Deprecated option
                cdnUrl = 'https://' + this._config.segmentHost;
            } else {
                cdnUrl = this._config.cdnURL;
            }

            this.load({writeKey: this._config.apiKey, cdnURL: cdnUrl});
        }
    }

    /**
     * Load Segment configuration.
     *
     * @param settingsOrApiKey Write API Key or Segment settings.
     * @param options Optional parameters.
     */
    public load(settingsOrApiKey: AnalyticsBrowserSettings | string, options: InitOptions = {}): void {
        let settings: AnalyticsBrowserSettings;
        if (typeof settingsOrApiKey === 'string') {
            settings = {writeKey: settingsOrApiKey};
        } else {
            settings = settingsOrApiKey;
        }

        SegmentService._segmentInstance.load(settings, options)
            .then(() => {
                if (this._config.debug) {
                    console.log('Segment initialized');
                }
            });

        this.debug(this._config.debug);
    }

    /**
     * The identify method is how you associate your users and their actions to a recognizable userId and traits.
     *
     * @param traits A dictionary of traits you know about the user, like their email or name.
     * @param options A dictionary of options.
     *
     * @returns
     */
    public async identify(traits: any, options?: any): Promise<SegmentService>;

    /**
     * The identify method is how you associate your users and their actions to a recognizable userId and traits.
     *
     * @param userId The database ID for the user.
     * @param traits A dictionary of traits you know about the user, like their email or name.
     * @param options A dictionary of options.
     *
     * @returns
     */
    public async identify(userId: string, traits?: any, options?: any): Promise<SegmentService>;
    public async identify(userId: string, traits?: any, options?: any): Promise<SegmentService> {
        await SegmentService._segmentInstance.identify(userId, traits, options);

        return this;
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
    public async track(event: string, properties?: any, options?: any): Promise<SegmentService> {
        await SegmentService._segmentInstance.track(event, properties, options);

        return this;
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
    public async page(name?: string, properties?: any, options?: any): Promise<SegmentService>;

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
    public async page(category: string, name: string, properties?: any, options?: any): Promise<SegmentService>;

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
    public async page(category?: string, name?: string, properties?: any, options?: any): Promise<SegmentService> {
        await SegmentService._segmentInstance.page(category, name, properties, options);

        return this;
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
    public async group(groupId: string, traits?: any): Promise<SegmentService> {
        await SegmentService._segmentInstance.group(groupId, traits);

        return this;
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
    public async alias(userId: string, previousId?: string, options?: any): Promise<SegmentService> {
        await SegmentService._segmentInstance.alias(userId, previousId, options);

        return this;
    }

    /**
     * The ready method allows you execute a promise that will be called as soon as all of your enabled destinations have loaded
     * and analytics.js has completed initialization.
     *
     * @returns
     */
    public async ready(): Promise<SegmentService> {
        await SegmentService._segmentInstance.ready();

        return this;
    }

    /**
     * Return information about the currently identified user
     *
     * @returns Informations about the currently identified user
     */
    public user(): User | null {
        return SegmentService._segmentInstance.instance.user();
    }

    /**
     * Return identifier about the currently identified user
     *
     * @returns Identifier about the currently identified user
     */
    public id(): string | null {
        return this.user()?.id();
    }

    /**
     * Override the default Anonymous ID
     *
     * @param anonymousId New anonymous ID
     */
    public setAnonymousId(anonymousId: string): void {
        SegmentService._segmentInstance.setAnonymousId(anonymousId);
    }

    /**
     * Return traits about the currently identified user
     *
     * @returns Traits about the currently identified user
     */
    public traits(): any {
        return this.user()?.traits();
    }

    /**
     * Reset the id, including anonymousId, and clear traits for the currently identified user and group.
     */
    public reset(): void {
        SegmentService._segmentInstance.reset();
    }

    /**
     * Turn on/off debug mode, logging helpful messages to the console.
     *
     * @param enabled Enable or not the debug mode
     */
    public debug(enabled?: boolean): void {
        SegmentService._segmentInstance.debug(enabled);
    }

    /**
     * Set listeners for these events and run your own custom code.
     *
     * @param method Name of the method to listen for
     * @param callback A function to execute after each the emitted method
     */
    public on(method: string, callback: (event?: string, properties?: any, options?: any) => any): void {
        SegmentService._segmentInstance.on(method, callback);
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
        SegmentService._segmentInstance.trackLink(elements, event, properties);
    }

    /**
     * Binds a `track` call to a form submission.
     *
     * @param forms The form element to track or an array of form
     * @param event The name of the event, passed to the `track` method.
     * @param properties A dictionary of properties to pass with the `track` method.
     */
    public trackForm(forms: HTMLFormElement | HTMLFormElement[], event: string | Function, properties?: any | Function): void {
        SegmentService._segmentInstance.trackSubmit(forms, event, properties);
    }

    /**
     * Add a source middleware called on events
     *
     * @param middleware Custom function
     */
    public addSourceMiddleware(middleware: SourceMiddleware): void {
        SegmentService._segmentInstance.addSourceMiddleware(middleware);
    }

    /**
     * Add destination middlewares called on events
     *
     * @param integration Integration name
     * @param middlewares Custom functions
     */
    public addDestinationMiddleware(integration: string, ...middlewares: DestinationMiddleware[]): void {
        SegmentService._segmentInstance.addDestinationMiddleware(integration, ...middlewares);
    }

    /**
     * Register plugins
     *
     * @param plugins
     */
    public async register(...plugins: NewSegmentPlugin[]): Promise<void> {
        await SegmentService._segmentInstance.register(...plugins);

        return;
    }

    public get segmentInstance(): Analytics {
        return SegmentService._segmentInstance.instance;
    }
}
