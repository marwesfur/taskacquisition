import {Page, Alert, NavController, Loading} from 'ionic-angular';
import {ImagePicker} from 'ionic-native';
import {Camera} from 'ionic-native';
import TaskComponent from '../../components/task/Task';

const createTaskUrl = 'http://172.24.59.212:8123/tasks/tasks';

const cameraOptions = {
    destinationType: 0,
    targetWidth: 640,
    targetHeight: 480
};

class Task {
    constructor(public title = '', public images: Image[] = []) {}

    public addImage(img: Image) {
        this.images = this.images.concat([img]);
    }

    public deleteImage(img: Image) {
        this.images = this.images.filter(_ => _ != img);
    }

    public getFrontImage() {
        return this.images[0];
    }

    public isValid() {
        return !!this.title && this.images.length > 0 && this.images.every(_ => !!_.description);
    }
}

class Image {
    constructor(public src:string, public description = '') {
    }

    public toResourceUrl() {
        return 'data:image/jpeg;base64,' + this.src;
    }
}

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

function put(url: string, formData: FormData) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject(xhr.response);
                }
            }
        };
        xhr.open("PUT", url, true);
        xhr.send(formData);
    });
}

function waitWhile<T>(nav: NavController, p: Promise<T>): Promise<T> {
    let loading = Loading.create({content: "Wird übertragen"});
    nav.present(loading);
    p.then(() => loading.dismiss(), () => loading.dismiss());
    return p;
}

@Page({
    templateUrl: 'build/pages/taskacquisition/taskacquisition.html',
    directives: [TaskComponent]
})
export class TaskAcquisitionPage {

    public task:Task;
    public savedTasks: Task[] = [];

    constructor(public nav: NavController) {
        this.newTask();
    }

    public newTask() {
        this.task = new Task();
    }

    public saveTask() {
        if (!this.task.isValid()) {
            let alert = Alert.create({
                title: 'Ungültige Eingabe',
                subTitle: 'Bitte vergeben Sie eine Gesamtbeschreibung und erstellen Sie wenigstens ein Bild mit Beschreibung',
                buttons: ['OK']
            });
            this.nav.present(alert);
        }
        else {
            this.savedTasks.push(this.task);
            this.newTask();
        }
    }

    public deleteTask(task: Task) {
        this.savedTasks = this.savedTasks.filter(_ => _ != task);
    }

    public submitTask(task: Task) {
        waitWhile(this.nav, put(createTaskUrl, taskToFormData(task)))
            .then(() => {
                let alert = Alert.create({
                    title: 'Übertragen',
                    subTitle: 'Die Aufgabe wurde an den Kummerkasten übertragen',
                    buttons: ['OK']
                });
                this.nav.present(alert);
                this.deleteTask(task);
            });
    }

    public deleteImage(img: Image) {
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
