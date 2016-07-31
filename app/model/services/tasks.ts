import {Injectable} from 'angular2/core';
import {Task, Image} from '../types';
import {Settings} from './settings';
import {put} from "../../infrastructure/http"


function taskToFormData(task: Task) {
    var formData = new FormData();
    formData.append('title', task.title);
    task.images.forEach((img, idx) => {
        formData.append(`description${idx}`, img.description);
        formData.append("files[]", toBlob(img), `image${idx}.jpg`);
    });

    return formData;

    function toBlob(img: Image) {
        var byteCharacters = atob(img.src);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], {type: 'image/jpg'});
    }
}


@Injectable()
export class Tasks {
    private tasks: Task[] = [];

    constructor(private settings: Settings) {

    }

    public getTasks(): Task[] {
        return this.tasks;
    }

    public addTask(task: Task) {
        this.tasks = this.tasks.concat([task]);
    }

    public removeTask(task: Task) {
        this.tasks = this.tasks.filter(_ => _ != task);
    }

    public sendTask(task: Task): Promise<void> {
        return put(this.settings.getTaskUrl(), taskToFormData(task));
    }
}
