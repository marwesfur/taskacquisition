import {Component, forwardRef, Directive, Host, EventEmitter, ElementRef, NgZone, Input, Output, Renderer, ChangeDetectionStrategy, ViewEncapsulation, OnInit, OnDestroy} from 'angular2/core';


import {Gesture} from 'ionic-angular/gestures/gesture'
import {SwipeController} from '../swipetarget/SwipeTarget'
declare var Hammer: any;

class SwipeToGiveGesture {

    constructor(private ele: HTMLElement, swipedOut) {

        var pan = new Hammer.Pan({direction: Hammer.DIRECTION_UP, threshold: 0}),
            swipe = new Hammer.Swipe({direction: Hammer.DIRECTION_UP, velocity: 0.05, threshold: 100});

        var mc = new Hammer.Manager(ele);

        mc.add(pan);
        mc.add(swipe).recognizeWith(pan);

        mc.on('swipeup', e => {
            console.log('swipeup');

            this.ele.classList.add('task__onSwiped');
            setTimeout(swipedOut, 500);
        })

        mc.on('panstart', e => {
            console.debug('SwipeToGiveGesture, onSlideBeforeStart');

            this.ele.classList.add('task__onBeforeSwipe');
        })

        mc.on('panend', e => {
            console.debug('SwipeToGiveGesture, onSlideEnd');

            this.ele.classList.remove('task__onBeforeSwipe');
        })
     }
}

@Component({
    selector: 'task',
    templateUrl: 'build/components/task/task.html'
})
export default class TaskComponent {
    private _gesture: SwipeToGiveGesture;

    @Input() value: any;
    @Output() delete = new EventEmitter<void>();
    @Output() submit = new EventEmitter<void>();

    constructor(private el:ElementRef, private swipeCtrl: SwipeController) {
    }

    ngOnInit() {
        this._gesture = new SwipeToGiveGesture(this.el.nativeElement, () => this.deleteTask());
    }

    deleteTask() {
        this.delete.emit(undefined);
        this.swipeCtrl.open();
    }

    submitTask() {
        this.submit.emit(undefined);
    }
}