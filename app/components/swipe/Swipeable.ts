import {Component, forwardRef, Directive, Host, EventEmitter, ElementRef, NgZone, Input, Output, Renderer, ChangeDetectionStrategy, ViewEncapsulation, OnInit, OnDestroy} from 'angular2/core';
import {Gesture} from 'ionic-angular/gestures/gesture'
declare var Hammer: any;

import {SwipeController} from './SwipeController'

const pan = new Hammer.Pan({direction: Hammer.DIRECTION_ALL, threshold: 0}),
      swipe = new Hammer.Swipe({direction: Hammer.DIRECTION_UP, velocity: 0.05, threshold: 100});


class SwipeGesture {

    private _hammer;

    constructor(private ele: HTMLElement, private swipedOut) {
    }

    public listen() {
        if (this._hammer)
            return;

        let mc = this._hammer = new Hammer.Manager(this.ele);

        mc.add(pan);
        mc.add(swipe).recognizeWith(pan);

        mc.on('swipeup', e => {
            this.ele.classList.add('swipeable__onSwiped');
            setTimeout(this.swipedOut, 400);
        });

        mc.on('panstart', e => {
            this.ele.classList.add('swipeable__onBeforeSwipe');
        });

        mc.on('panend', e => {
            this.ele.classList.remove('swipeable__onBeforeSwipe');
        });
    }

    public unlisten() {
        if (!this._hammer)
            return;

        this._hammer.destroy();
        this._hammer = null;
    }
}

@Component({
    selector: 'swipeable',
    template: '<ng-content></ng-content>'
})
export class Swipeable {
    _gesture: SwipeGesture;

    @Output() swiped = new EventEmitter<void>();

    constructor(private el: ElementRef, private ctrl: SwipeController) {
        this._gesture = new SwipeGesture(this.el.nativeElement, () => this.swiped.emit(null));
        ctrl.availabilityChanged.subscribe(availabilityInfo => this.updateAvailability(availabilityInfo));
    }

    ngOnInit() {
        this.updateAvailability(this.ctrl.getAvailabilityInfo());
    }

    public updateAvailability(availabilityInfo) {
        let ele = this.el.nativeElement;

        if (availabilityInfo.available) {
            this._gesture.listen();
            ele.classList.add('swipeable__available');
        } else {
            this._gesture.unlisten();
            ele.classList.remove('swipeable__available');
        }
    }
}