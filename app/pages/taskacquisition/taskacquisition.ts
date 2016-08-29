import {OnInit, OnDestroy} from 'angular2/core';
import {Page, Alert, NavController, Loading} from 'ionic-angular';
import {CreateTaskPage} from '../createtask/createtask';
import {Task, Image} from '../../model/types';
import TaskComponent from '../../components/task/Task';
import {SwipeController} from '../../components/swipe/SwipeController'
import {Tasks} from "../../model/services/tasks";
import {Localization} from "../../model/services/localization";
import {Swipeable} from "../../components/swipe/Swipeable";
import {waitWhile} from "../../infrastructure/waitwhile"
import {Subscription} from "rxjs/Subscription"


const unknownLocation = 'unknown';


@Page({
    templateUrl: 'build/pages/taskacquisition/taskacquisition.html',
    directives: [TaskComponent, Swipeable]
})
export class TaskAcquisitionPage implements OnInit, OnDestroy {
    private targetsOpen = false;
    private subscription: Subscription = null;

    private swipeTargets = [
        //{ name: 'Mülleimer', onSwiped: task => this.deleteTask(task) },
        { name: 'Kummerkasten', onSwiped: task => this.submitTask(task) },
    ];


    constructor(public nav: NavController, private swipeCtrl: SwipeController, public tasks: Tasks, private localization: Localization) {

    }

    ngOnInit() {
        this.subscription = this.localization.locationChanged.subscribe(() => {
            this.targetsOpen = this.localization.getLocation() !== unknownLocation;
            this.onTargetsOpenChanged();
        });
        this.localization.start();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.localization.stop();
    }

    public toggleSwipeAvailability() {
        this.targetsOpen = !this.targetsOpen;
        this.onTargetsOpenChanged();
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
        return waitWhile(this.nav, this.tasks.sendTask(task))
            .then(() => {
                let alert = Alert.create({
                    title: 'Übertragen',
                    subTitle: 'Die Aufgabe wurde an den Kummerkasten übertragen',
                    buttons: ['OK']
                });
                this.nav.present(alert);
            })
            .catch(() => {
                // todo: handle error case
            })
            .then(() => this.deleteTask(task));
    }

    private onTargetsOpenChanged() {
        this.swipeTargets.forEach(_ => this.swipeCtrl.removeTarget(_));
        if (this.targetsOpen) {
            this.swipeTargets.forEach(_ => this.swipeCtrl.addTarget(_));
        }
    }
}
