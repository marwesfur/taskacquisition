import {Injectable} from "angular2/core"
import {get} from "../../infrastructure/http"
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';
import {Settings} from './settings';

// todo: wrap iBeacon stuff in iBeaconLocalization
function setupIBeacon() {
    //var uuid = 'B9407F30-F5F8-466E-AFF9-25556B57FE6D';
    //var identifier = 'beaconOnTheTable';
    //var minor = undefined; //53356;
    //var major = undefined; //55998;
    //var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);
    //
    //var delegate = new cordova.plugins.locationManager.Delegate();
    //
    //delegate.didDetermineStateForRegion = function (pluginResult) {
    //    console.log('didDetermineStateForRegion: ', pluginResult);
    //};
    //
    //delegate.didStartMonitoringForRegion = function (pluginResult) {
    //    console.log('didStartMonitoringForRegion:', pluginResult);
    //};
    //
    //delegate.didRangeBeaconsInRegion = function (pluginResult) {
    //    console.log('didRangeBeaconsInRegion: ', pluginResult);
    //
    //    var isImmediate = pluginResult.beacons.length > 0 && (pluginResult.beacons[0].proximity == 'ProximityImmediate');
    //
    //    // todo: add target to controller
    //};
    //
    //cordova.plugins.locationManager.setDelegate(delegate);
    //cordova.plugins.locationManager.requestAlwaysAuthorization();
    //
    //cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
    //    .fail(function(e) { console.error(e); })
    //    .done();
}

export abstract class Localization {
    locationChanged: Observable<any>;
    abstract start(): void;
    abstract stop(): void;
    abstract getLocation(): string;
}

const pollingIntervalInMs = 1000;

@Injectable()
export class RemoteControlledLocalization extends Localization {

    public locationChanged: Observable<any>;

    private _observer: Observer<any>;
    private location: string;
    private timeout: any;

    constructor(private settings: Settings) {
        super();
        this.locationChanged = new Observable(observer => this._observer = observer).share();
    }

    public start() {
        this.timeout = setTimeout(() => this.poll(), pollingIntervalInMs);
    }

    public stop() {
        clearTimeout(this.timeout);
    }

    public getLocation() {
        return this.location;
    }

    private poll() {
        console.log(`polling ${this.settings.getRemoteControllerUrl()}`);

        get(this.settings.getRemoteControllerUrl())
            .then(location => {
                this.setLocation(location);
                this.start();
            }, () => this.start()); // in case of error, just try again.
    }

    private setLocation(location) {
        if (this.location != location) {
            this.location = location;
            this._observer.next(this.location);
        }
    }
}
