import {Component, forwardRef, Directive, Host, EventEmitter, ElementRef, NgZone, Input, Output, Renderer, ChangeDetectionStrategy, ViewEncapsulation} from 'angular2/core';

import {Ion} from 'ionic-angular';


@Component({
    selector: 'task',
    templateUrl: 'build/components/task/task.html'
})
export default class TaskComponent {

    @Input() value: any;
    @Output() delete = new EventEmitter<void>();
    @Output() submit = new EventEmitter<void>();

    deleteTask() {
        this.delete.emit(undefined);
    }

    submitTask() {
        this.submit.emit(undefined);
    }
}