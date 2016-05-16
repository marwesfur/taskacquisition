import {Component, forwardRef, Directive, Host, EventEmitter, ElementRef, NgZone, Input, Output, Renderer, ChangeDetectionStrategy, ViewEncapsulation, OnInit, OnDestroy, Injectable} from 'angular2/core';
import {Animation} from 'ionic-angular/animations/animation'

export class SwipeController {

    public _target: SwipeTarget;

    public open() {
        this._target.show();
    }
}

@Component({
    selector: 'swipe-target',
    template: '<div>Hierher swipen</div>'
})
export class SwipeTarget {
    @Input() content: any;

    ani: Animation = new Animation();

    constructor(private el:ElementRef, private ctrl: SwipeController) {
        ctrl._target = this;
    }

    ngOnInit() {

        let _cntEle = this.content.getNativeElement();


        this.ani
            .easing('ease')
            .duration(2000);

        let targetAni = new Animation(this.el.nativeElement);
        targetAni.fromTo('translateY', '-100px', '0px');
        targetAni.fromTo('background', 'red', 'green');
        this.ani.add(targetAni);

        let contentAni = new Animation(_cntEle);
        contentAni.fromTo('translateY', '0px', '100px');
        this.ani.add(contentAni);
    }

    public show() {
        this.ani.play();
    }
}

