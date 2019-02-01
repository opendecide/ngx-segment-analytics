# ngx-segment-analytics

[![Build Status](https://travis-ci.org/opendecide/ngx-segment-analytics.svg?branch=master)](https://travis-ci.org/opendecide/ngx-segment-analytics)
[![GitHub Downloads All Releases](https://img.shields.io/github/downloads/opendecide/ngx-segment-analytics/total.svg)](https://github.com/opendecide/ngx-segment-analytics)
[![npm Downloads All Releases](https://img.shields.io/npm/dw/ngx-segment-analytics.svg)](https://www.npmjs.com/package/ngx-segment-analytics)
[![npm Version](https://img.shields.io/npm/v/ngx-segment-analytics.svg)](https://www.npmjs.com/package/ngx-segment-analytics)
[![node Version Required](https://img.shields.io/node/v/ngx-segment-analytics.svg)](https://www.npmjs.com/package/ngx-segment-analytics)

This Angular module provides an API for Segment using the `analytics.js` official library.

## Installation

To install this library, run:

```bash
$ npm install --save ngx-segment-analytics
```

## Consuming Segment

Add the `SegmentModule` to your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import the Segment module
import { SegmentModule } from 'ngx-segment-analytics';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // Segment Importation
    SegmentModule.forRoot({ apiKey: 'YOUR_WRITE_APIKEY', debug: true, loadOnInitialization: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

You can use the `SegmentService` in any constructor as a injected service :

```typescript
import { Component, OnInit } from '@angular/core';
import { SegmentService } from 'ngx-segment-analytics';
@Component({
    selector: 'hero',
    templateUrl: './hero.component.html',
    styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {

    constructor(private segment: SegmentService) { }

    public ngOnInit() {
        this.segment.track('load an hero')
            .then(() => console.log("Event sended"));
    }
    
}
```

## Documentation

A full documentation is available [here](https://opendecide.github.io/ngx-segment-analytics/)

## API

This API is compatible with `analytics.js` but returns `Promises` instead of taking `callbacks` in parameters.

```typescript
load(apiKey: string, options: any);
get plugins: {[pluginName :string]: SegmentPlugin};
identify(userId?: string, traits?: any, options?: any): Promise<SegmentService>;
track(event: string, properties?: any, options?: any): Promise<SegmentService>;
page(category?: string, name?: string, properties?: any, options?: any): Promise<SegmentService>;
group(groupId: string, traits?: any): Promise<SegmentService>;
alias(userId: string, previousId?: string, options?: any): Promise<SegmentService>;
ready(): Promise<SegmentService>;
user(): any;
id(): any;
traits(): any;
reset(): void;
debug(enabled?: boolean): void;
on(method: string, callback: (event?: string, properties?: any, options?: any) => any): void;
trackLink(elements: HTMLElement | HTMLElement[], event: string | Function, properties?: Object | Function): void;
trackForm(forms: HTMLElement | HTMLElement[], event: string | Function, properties?: Object | Function): void;
timeout(timeout: number): void;
```

## Development

To lint all `*.ts` files:

```bash
$ npm run lint
```

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To publish on npmjs registry :
```bash
$ npm publish dist
```


## License

MIT ©2017 [OpenDecide](https://www.opendecide.com)
