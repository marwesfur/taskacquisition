import {Component, forwardRef, Directive, Host, EventEmitter, ElementRef, NgZone, Input, Output, Renderer, ChangeDetectionStrategy, ViewEncapsulation, OnInit, OnDestroy, Injectable} from 'angular2/core';
import {Animation} from 'ionic-angular/animations/animation'
import {NgClass} from 'angular2/common';

import {SwipeController} from './SwipeController'


@Component({
    selector: 'swipe-target-container',
    templateUrl: 'build/components/swipe/TargetContainer.html',
    directives: [NgClass]
})
export class TargetContainer {
    @Input() content: any;

    ani: Animation;
    targetsInfo = {available: false, targets: []};

    constructor(private el:ElementRef, private ctrl: SwipeController) {
        ctrl.targetContainer = this;
    }

    ngOnInit() {
        this.ani = new Animation();
        this.ani
            .easing('ease')
            .duration(250);

        const targetAni = new Animation(this.el.nativeElement);
        targetAni.fromTo('translateY', '-100px', '0px')
        this.ani.add(targetAni);

        const cntEle = this.content.getNativeElement();
        const contentAni = new Animation(cntEle);
        contentAni.fromTo('translateY', '0px', '100px');
        this.ani.add(contentAni);
    }

    public updateTargets(targetInfo) {
        if (this.targetsInfo.available != targetInfo.available) {
            this.ani
                .reverse(!targetInfo.available)
                .play();
        }

        this.targetsInfo = targetInfo;
    }

    public itemSwiping(center, angle) {
        const widthPerTarget = this.el.nativeElement.offsetWidth / this.targetsInfo.targets.length;
        const targetsWithBoundaries = this.targetsInfo.targets.map((target, idx) => {
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

    public itemSwiped(data) {
        var target = this.targetsInfo.targets.find(_ => _.isSelected);
        target.onSwiped(data);
    }
}

