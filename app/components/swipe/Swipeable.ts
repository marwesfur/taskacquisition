import {Component, forwardRef, Directive, Host, EventEmitter, ElementRef, NgZone, Input, Output, Renderer, ChangeDetectionStrategy, ViewEncapsulation, OnInit, OnDestroy} from 'angular2/core';
import {Gesture} from 'ionic-angular/gestures/gesture'
import {Animation} from 'ionic-angular/animations/animation'
declare var Hammer: any;

import {SwipeController} from './SwipeController'

function LateSwipeRecognizer() {
    Hammer.AttrRecognizer.apply(this, arguments);
}

Hammer.inherit(LateSwipeRecognizer, Hammer.AttrRecognizer, {
    defaults: {
        event: 'lateswipe',
        threshold: 10,
        velocity: 0.3,
        direction: Hammer.DIRECTION_HORIZONTAL | Hammer.DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return Hammer.Pan.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (Hammer.DIRECTION_HORIZONTAL |Hammer. DIRECTION_VERTICAL)) {
            velocity = input.velocity;
        } else if (direction & Hammer.DIRECTION_HORIZONTAL) {
            velocity = input.velocityX;
        } else if (direction & Hammer.DIRECTION_VERTICAL) {
            velocity = input.velocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.direction &&
            input.distance > this.options.threshold &&
            input.maxPointers == this.options.pointers &&
            Math.abs(velocity) > this.options.velocity && input.eventType & Hammer.INPUT_END;
    },

    emit: function(input) {
        //var direction = Hammer.directionStr(input.offsetDirection);
        //if (direction) {
        //    this.manager.emit(this.options.event + direction, input);
        //}

        this.manager.emit(this.options.event, input);
    }
});

class SwipeGesture {
    private _hammer;
    private _ani;

    constructor(private ele: HTMLElement, private ctrl: SwipeController, private getValue) {
    }

    public listen() {
        if (this._hammer)
            return;

        let ele = this.ele;
        let mc = this._hammer = new Hammer.Manager(ele);

        let ani = this._ani = new Animation(ele);
        ani.duration(0);

        const pan = new Hammer.Pan({direction: Hammer.DIRECTION_ALL, threshold: 9}),
            swipe = new (<any>LateSwipeRecognizer)({direction: Hammer.DIRECTION_UP});

        mc.add(swipe);
        mc.add(pan).recognizeWith(swipe);

        let lastX = 0,
            lastY = 0;

        let swiped = false;

        mc.on('lateswipe', e => {
            swiped = true;
            ani
                .fromTo('translateY', lastY + 'px', '-400px')
                .fromTo('rotateX', '45deg', '0')
                .duration(1000)
                .onFinish(() => this.ctrl.targetContainer.itemSwiped(this.getValue()))
                .play();
        });

        mc.on('panstart', e => {
            ani = new Animation(ele);
            ani
                .fromTo('translateX', lastX + 'px', e.deltaX + 'px')
                .fromTo('translateY', lastY + 'px', e.deltaY + 'px')
                .fromTo('perspective', '600px', '600px')
                .fromTo('rotateX', '0', '20deg')
                .duration(200)
                .play();

            lastX = e.deltaX;
            lastY = e.deltaY;
        });

        mc.on('panend', e => {
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
            if (swiped)
                return;

            this.ctrl.targetContainer.itemSwiping(e.center, e.angle);
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

@Directive({
    selector: '[swipeable]',
})
export class Swipeable {
    _gesture: SwipeGesture;

    @Input('swipeable') value: any;

    constructor(private el: ElementRef, private ctrl: SwipeController) {
        var i = 0;
    }

    ngAfterViewInit() {
        this._gesture = new SwipeGesture(this.el.nativeElement, this.ctrl, () => this.value);
        this.ctrl.targetsChanged.subscribe(availabilityInfo => this.updateTargetAvailability(availabilityInfo));
        this.updateTargetAvailability(this.ctrl.getAvailabilityInfo());
    }

    public updateTargetAvailability(availabilityInfo) {
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