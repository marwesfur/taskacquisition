import {Storage, LocalStorage} from "ionic-angular";

const hostStorageKey = 'settings_host';
const deviceNameStorageKey = 'settings_deviceName';

export class Settings {

    private host: string = null;
    private deviceName: string = null;
    private local: Storage;

    constructor() {
        this.local = new Storage(LocalStorage);
        this.local.get(hostStorageKey).then(value => this.host = value || '172.24.59.212:8123');
        this.local.get(deviceNameStorageKey).then(value => this.deviceName = value || 'taskAcquisitionApp');
    }

    public setHost(host: string) {
        this.host = host;
        this.local.set(hostStorageKey, this.host);
    }

    public getHost() {
        return this.host;
    }

    public setDeviceName(deviceName: string) {
        this.deviceName = deviceName;
        this.local.set(deviceNameStorageKey, this.deviceName);
    }

    public getDeviceName() {
        return this.deviceName;
    }

    public getRemoteControllerUrl(host?: string, deviceName?: string) {
        host = host || this.host;
        deviceName = deviceName || this.deviceName;

        return `http://${host}/dispatcher/location?device=${deviceName}`;
    }

    public getTaskUrl(host?: string) {
        host = host || this.host;

        return `http://${host}/tasks/tasks`;
    }
}
