import {Component, forwardRef, Directive, Host, EventEmitter, ElementRef, NgZone, Input, Output, Renderer, ChangeDetectionStrategy, ViewEncapsulation} from 'angular2/core';

import {Ion} from 'ionic-angular';
import {SlideGesture} from "ionic-angular/gestures/slide-gesture";
import {SlideData} from "ionic-angular/gestures/slide-gesture";

class SwipeToGiveGesture extends SlideGesture {

    constructor(private ele: HTMLElement) {
        super(ele, { direction: 'x' });
    }

    // Set CSS, then wait one frame for it to apply before sliding starts
    onSlideBeforeStart(slide: SlideData, ev: any) {
        console.debug('SwipeToGiveGesture, onSlideBeforeStart');

        this.ele.classList.add('task__onBeforeSwipe');
    }

    onSlideEnd(slide?: SlideData, ev?: any): void {
        console.debug('SwipeToGiveGesture, onSlideBeforeStart');

        this.ele.classList.remove('task__onBeforeSwipe');
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

    constructor(private el:ElementRef) {

    }

    ngOnInit() {
        this._gesture = new SwipeToGiveGesture(this.el.nativeElement);
        this._gesture.listen();
    }

    deleteTask() {
        this.delete.emit(undefined);
    }

    submitTask() {
        this.submit.emit(undefined);
    }
}