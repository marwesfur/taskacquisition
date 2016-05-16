import {Component, forwardRef, Directive, Host, EventEmitter, ElementRef, NgZone, Input, Output, Renderer, ChangeDetectionStrategy, ViewEncapsulation, OnInit, OnDestroy} from 'angular2/core';

import {Gesture} from 'ionic-angular/gestures/gesture'
declare var Hammer: any;

class SwipeToGiveGesture {

    constructor(private ele: HTMLElement, swipedOut) {

        var pan = new Hammer.Pan({direction: Hammer.DIRECTION_UP, threshold: 0}),
            swipe = new Hammer.Swipe({direction: Hammer.DIRECTION_UP, velocity: 0.05, threshold: 100});

        var mc = new Hammer.Manager(ele);

        mc.add(pan);
        mc.add(swipe).recognizeWith(pan);

        mc.on('swipeup', e => {
            this.ele.classList.add('swipeable__onSwiped');
            setTimeout(swipedOut, 500);
        });

        mc.on('panstart', e => {
            this.ele.classList.add('swipeable__onBeforeSwipe');
        });

        mc.on('panend', e => {
            this.ele.classList.remove('swipeable__onBeforeSwipe');
        });
    }
}

@Component({
    selector: 'swipeable',
    template: '<ng-content></ng-content>'
})
export class Swipeable {
    _gesture: SwipeToGiveGesture;

    @Output() swiped = new EventEmitter<void>();

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        this._gesture = new SwipeToGiveGesture(this.el.nativeElement, () => this.swiped.emit(undefined));
    }
}