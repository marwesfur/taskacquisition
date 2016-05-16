import {Component, forwardRef, Directive, Host, EventEmitter, ElementRef, NgZone, Input, Output, Renderer, ChangeDetectionStrategy, ViewEncapsulation, OnInit, OnDestroy} from 'angular2/core';
import {Gesture} from 'ionic-angular/gestures/gesture'
import {Animation} from 'ionic-angular/animations/animation'
declare var Hammer: any;

import {SwipeController} from './SwipeController'

const pan = new Hammer.Pan({direction: Hammer.DIRECTION_ALL, threshold: 9}),
      press = new Hammer.Press({time: 0, threshold: 100}),
      swipe = new Hammer.Swipe({direction: Hammer.DIRECTION_UP, velocity: 0.05, threshold: 100});


class SwipeGesture {

    private _hammer;

    constructor(private ele: HTMLElement, private swipedOut) {
    }

    public listen() {
        if (this._hammer)
            return;

        let ele = this.ele;
        let mc = this._hammer = new Hammer.Manager(ele);

        mc.add(pan);
        mc.add(press).recognizeWith(pan);
        mc.add(swipe).recognizeWith(pan).recognizeWith(press);


        mc.on('swipeup', e => {
            this.ele.classList.add('swipeable__onBeforeSwipe');
            this.ele.classList.add('swipeable__onSwiped');
            //setTimeout(this.swipedOut, 400);
        });

        mc.on('press', e => {
            this.ele.classList.add('swipeable__onBeforeSwipe');
        });

        mc.on('pressup', e => {
            this.ele.classList.remove('swipeable__onBeforeSwipe');
        });

        mc.on('panstart', e => {
            this.ele.classList.add('swipeable__onBeforeSwipe');
        });

        mc.on('panend', e => {
            this.ele.classList.remove('swipeable__onBeforeSwipe');
        });

        mc.on('panmove', e => {
            let ani = new Animation(ele);
            ani
                .duration(0)
                .fromTo('translateY', '0', e.deltaY + 'px')
                .fromTo('translateX', '0', e.deltaX + 'px')
                .play();
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