import {Component, forwardRef, Directive, Host, EventEmitter, ElementRef, NgZone, Input, Output, Renderer, ChangeDetectionStrategy, ViewEncapsulation, OnInit, OnDestroy} from 'angular2/core';


import {SwipeController} from '../swipe/SwipeTarget'
import {Swipeable} from '../swipe/Swipeable'


@Component({
    selector: 'task',
    templateUrl: 'build/components/task/task.html',
    directives: [Swipeable]
})
export default class TaskComponent {

    @Input() value: any;
    @Output() delete = new EventEmitter<void>();
    @Output() submit = new EventEmitter<void>();

    constructor(private swipeCtrl: SwipeController) {
    }

    swiped() {
       this.deleteTask();
    }

    deleteTask() {
        this.delete.emit(undefined);
        this.swipeCtrl.open();
    }

    submitTask() {
        this.submit.emit(undefined);
    }
}