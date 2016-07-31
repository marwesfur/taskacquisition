import {Storage, LocalStorage} from "ionic-angular";

const urlStorageKey = 'settings_url';

export class Settings {

    private url: string = null;
    private local: Storage;

    constructor() {
        this.local = new Storage(LocalStorage);
        this.local.get(urlStorageKey).then(value => this.url = value || 'http://172.24.59.212:8123/tasks/tasks');
    }

    public setUrl(url: string) {
        this.url = url;
        this.local.set(urlStorageKey, this.url);
    }

    public getUrl() {
        return this.url;
    }

}
