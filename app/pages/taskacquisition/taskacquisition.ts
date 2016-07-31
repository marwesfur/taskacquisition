import {Page, Alert, NavController, Loading} from 'ionic-angular';

import {CreateTaskPage} from '../createtask/createtask';
import {Task, Image} from '../../model/types';
import TaskComponent from '../../components/task/Task';
import {SwipeController} from '../../components/swipe/SwipeController'
import {Tasks} from "../../model/services/tasks";
import {Swipeable} from "../../components/swipe/Swipeable";
import {put} from "../../infrastructure/http"


const createTaskUrl = 'http://172.24.59.212:8123/tasks/tasks';

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

function waitWhile<T>(nav: NavController, p: Promise<T>): Promise<T> {
    let loading = Loading.create({content: "Wird übertragen"});
    nav.present(loading);
    p.then(() => loading.dismiss(), () => loading.dismiss());
    return p;
}

@Page({
    templateUrl: 'build/pages/taskacquisition/taskacquisition.html',
    directives: [TaskComponent, Swipeable]
})
export class TaskAcquisitionPage {

    private targetsOpen = false;
    private swipeTargets = [
        //{ name: 'Mülleimer', onSwiped: task => this.deleteTask(task) },
        { name: 'Kummerkasten', onSwiped: task => this.submitTask(task) },
    ];

    constructor(public nav: NavController, private swipeCtrl: SwipeController, public tasks: Tasks) {
        console.log('task acquisition constructor');
    }

    public toggleSwipeAvailability() {
        this.targetsOpen = !this.targetsOpen;
        if (this.targetsOpen)
            this.swipeTargets.forEach(_ => this.swipeCtrl.addTarget(_));
        else
            this.swipeTargets.forEach(_ => this.swipeCtrl.removeTarget(_));
    }

    public getTasks() {
        return this.tasks.getTasks();
    }

    public createTask() {
        this.nav.push(CreateTaskPage, { });
    }

    public deleteTask(task: Task): Promise<void> {
        this.tasks.removeTask(task);
        return Promise.resolve();
    }

    public submitTask(task: Task): Promise<void> {
        return waitWhile(this.nav, put(createTaskUrl, taskToFormData(task)))
            .then(() => {
                let alert = Alert.create({
                    title: 'Übertragen',
                    subTitle: 'Die Aufgabe wurde an den Kummerkasten übertragen',
                    buttons: ['OK']
                });
                this.nav.present(alert);
            })
            .catch(() => {
            })
            .then(() => this.deleteTask(task));
    }
}
