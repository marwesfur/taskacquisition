import {Component, forwardRef, Directive, Host, EventEmitter, ElementRef, NgZone, Input, Output, Renderer, ChangeDetectionStrategy, ViewEncapsulation, OnInit, OnDestroy} from 'angular2/core';
import {Gesture} from 'ionic-angular/gestures/gesture'
import {Animation} from 'ionic-angular/animations/animation'
declare var Hammer: any;

import {SwipeController} from './SwipeController'

const pan = new Hammer.Pan({direction: Hammer.DIRECTION_ALL, threshold: 9}),
      press = new Hammer.Press({time: 0, threshold: 100}),
      swipe = new Hammer.Swipe({direction: Hammer.DIRECTION_UP});


class SwipeGesture {

    private _hammer;
    private _ani;

    constructor(private ele: HTMLElement, private swipedOut) {
    }

    public listen() {
        if (this._hammer)
            return;

        let ele = this.ele;
        let mc = this._hammer = new Hammer.Manager(ele);

        let ani = this._ani = new Animation(ele);
        ani.duration(0);

        mc.add(swipe);
        mc.add(pan).recognizeWith(swipe);
        //mc.add(press).recognizeWith(pan);
        //.recognizeWith(press);

        let lastX = 0,
            lastY = 0;

        let swiped = false;

        mc.on('swipeup', e => {
      //      this.ele.classList.add('swipeable__onBeforeSwipe');
      //      this.ele.classList.add('swipeable__onSwiped');
            console.log('swipeup vy=' + e.velocityY)
            swiped = true;
            ani
                .fromTo('translateY', lastY + 'px', '-1000px')
                .fromTo('rotateX', '45deg', '0')
                .duration(4000)
                .play();
            setTimeout(this.swipedOut, 4000);
        });

        mc.on('press', e => {
            //this.ele.classList.add('swipeable__onBeforeSwipe');
        });

        mc.on('pressup', e => {
            //this.ele.classList.remove('swipeable__onBeforeSwipe');
        });

        mc.on('panstart', e => {
            //this.ele.classList.add('swipeable__onBeforeSwipe');
            console.log('------\npanstart')
            ani = new Animation(ele);
            ani
                .fromTo('translateX', lastX + 'px', e.deltaX + 'px')
                .fromTo('translateY', lastY + 'px', e.deltaY + 'px')
                .fromTo('perspective', '600px', '600px')
                .fromTo('rotateX', '0', '45deg')
                .duration(200)
                .play();

            lastX = e.deltaX;
            lastY = e.deltaY;
        });

        mc.on('panend', e => {
            //this.ele.classList.remove('swipeable__onBeforeSwipe');
            console.log('panned')
            if (swiped)
                return;
            ani
                .duration(100)
                .fromTo('translateX', lastX + 'px', '0px')
                .fromTo('translateY', lastY + 'px', '0px')
                .fromTo('rotateX', '45deg', '0')
                .play();

            lastX = 0;
            lastY = 0;
        });

        mc.on('panmove', e => {
            console.log('panmove')
            if (swiped)
                return;
            ani
                .fromTo('translateX', lastX + 'px', e.deltaX + 'px')
                .fromTo('translateY', lastY + 'px', e.deltaY + 'px')
                .duration(0)
                .play();

            lastX = e.deltaX;
            lastY = e.deltaY;
        });
    }

    public unlisten() {
        if (!this._hammer)
            return;

        this._hammer.destroy();
        this._hammer = null;
        this._ani.duration(100).reverse(true).play();
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