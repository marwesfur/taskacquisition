import {Page, Alert, NavController, NavParams} from 'ionic-angular';
import {ViewChild} from 'angular2/core'
import {Camera} from 'ionic-native';
import {Task, Image} from '../../model/types';
import {Tasks} from "../../model/services/tasks";

const cameraOptions = {
    destinationType: 0,
    targetWidth: 640,
    targetHeight: 480
};

@Page({
    templateUrl: 'build/pages/createtask/createtask.html'
})
export class CreateTaskPage {

    public task:Task = new Task();

    constructor(private nav:NavController, navParams:NavParams, private tasks:Tasks) {
    }

    public cancel() {
        this.nav.pop();
    }

    public save() {
        if (!this.task.isValid()) {
            let alert = Alert.create({
                title: 'Ungültige Eingabe',
                subTitle: 'Bitte vergeben Sie eine Gesamtbeschreibung und erstellen Sie wenigstens ein Bild mit Beschreibung',
                buttons: ['OK']
            });
            this.nav.present(alert);
        }
        else {
            this.tasks.addTask(this.task);
            this.nav.pop();
        }
    }

    public deleteImage(img:Image) {
        this.task.deleteImage(img);
    }

    public pickImage() {
        Camera.getPicture(cameraOptions)
            .then(imageData => {
                let base64Image = imageData;
                this.task.addImage(new Image(base64Image));
            })
            .catch(() => this.task.addImage(new Image('iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==')));
    }
}
