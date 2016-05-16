import {Component, forwardRef, Directive, Host, EventEmitter, ElementRef, NgZone, Input, Output, Renderer, ChangeDetectionStrategy, ViewEncapsulation, OnInit, OnDestroy, Injectable} from 'angular2/core';
import {Animation} from 'ionic-angular/animations/animation'

import {SwipeController} from './SwipeController'


@Component({
    selector: 'swipe-target',
    template: '<div>Hierher swipen</div>'
})
export class SwipeTarget {
    @Input() content: any;

    ani: Animation;

    constructor(private el:ElementRef, private ctrl: SwipeController) {
        ctrl.availabilityChanged.subscribe(availabilityInfo => this.onAvailabilityChanged(availabilityInfo));

        this.ani = new Animation();
        this.ani
            .easing('ease')
            .duration(250);
    }

    ngOnInit() {
        let cntEle = this.content.getNativeElement();

        let targetAni = new Animation(this.el.nativeElement);
        targetAni.fromTo('translateY', '-100px', '0px');
        targetAni.fromTo('background', 'red', 'green');
        this.ani.add(targetAni);

        let contentAni = new Animation(cntEle);
        contentAni.fromTo('translateY', '0px', '100px');
        this.ani.add(contentAni);
    }

    public onAvailabilityChanged(availabilityInfo) {
        this.ani
            .reverse(!availabilityInfo.available)
            .play();
    }
}

