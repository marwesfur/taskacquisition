import {get} from "../../infrastructure/http"
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';


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

function setupRemoteController(setLocation) {
    const device = 'taskAcquisition';
    const url = 'http://172.24.59.212:8123/dispatcher/location?device=' + device;

    function poll() {
        get(url)
            .then(location => {
                setLocation(location);
                setTimeout(poll, 1000);
            });
    }

    poll();
}


export class Localization {

    public locationChanged: Observable<any>;

    private _observer: Observer<any>;
    private location: string;

    constructor() {
        this.locationChanged = new Observable(observer => this._observer = observer).share();

        setupRemoteController(location => this.setLocation(location));
        //setupIBeacon();
    }


    public getLocation() {
        return this.location;
    }

    private setLocation(location) {
        if (this.location != location) {
            this.location = location;
            this._observer.next(this.location);
        }
    }
}
