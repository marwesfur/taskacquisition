import {Component, forwardRef, Directive, Host, EventEmitter, ElementRef, NgZone, Input, Output, Renderer, ChangeDetectionStrategy, ViewEncapsulation, OnInit, OnDestroy, Injectable} from 'angular2/core';
import {Animation} from 'ionic-angular/animations/animation'
import {NgClass} from 'angular2/common';

import {SwipeController} from './SwipeController'


@Component({
    selector: 'swipe-target',
    templateUrl: 'build/components/swipe/SwipeTarget.html',
    directives: [NgClass]
})
export class SwipeTarget {
    @Input() content: any;

    ani: Animation;
    targets: any[] = [];

    constructor(private el:ElementRef, private ctrl: SwipeController) {
        ctrl.availabilityChanged.subscribe(availabilityInfo => this.onAvailabilityChanged(availabilityInfo));
        ctrl.determineTarget = this.determineTarget.bind(this);

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

        this.targets = availabilityInfo.targets;
    }

    private determineTarget(center, angle) {
        const widthPerTarget = this.el.nativeElement.offsetWidth / this.targets.length;
        const targetsWithBoundaries = this.targets.map((target, idx) => {
            const left = idx*widthPerTarget,
                  right = left+widthPerTarget;

            const dxLeft = left-center.x,
                  dxRight = right-center.x,
                  dy = 100 - center.y;

            return {
                target: target,
                left: Math.atan2(dy, dxLeft) * 180 / Math.PI,
                right: Math.atan2(dy, dxRight) * 180 / Math.PI
            };

        });

        targetsWithBoundaries.forEach((targetWithBoundaries, idx) => {
            var rightOfLeft = idx == 0 ? true : targetWithBoundaries.left <= angle,
                leftOfRight = idx == targetsWithBoundaries.length -1 ? true : targetWithBoundaries.right >= angle;

            targetWithBoundaries.target.isSelected = rightOfLeft && leftOfRight;
        });
    }
}

