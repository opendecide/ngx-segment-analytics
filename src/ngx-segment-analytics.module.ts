import { NgModule, ModuleWithProviders, Optional, SkipSelf, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SegmentService } from './ngx-segment-analytics.service';
import { SegmentConfig } from './ngx-segment-analytics.config';

export const SEGMENT_CONFIG = new InjectionToken<SegmentConfig>('ngx-segment-analytics.config');

@NgModule({
    imports: [CommonModule],
    providers: [
        { provide: Window, useValue: window }
    ]
})
export class SegmentModule {

    public static forRoot(config: SegmentConfig): ModuleWithProviders {
        return {
            ngModule: SegmentModule,
            providers: [
                { provide: SEGMENT_CONFIG, useValue: config },
                SegmentService,
            ],
        };
    }

    constructor(@Optional() @SkipSelf() parentModule: SegmentModule) {
        if (parentModule) {
            throw new Error(
                'SegmentModule is already loaded. Import it in the AppModule only'
            );
        }
    }
}
