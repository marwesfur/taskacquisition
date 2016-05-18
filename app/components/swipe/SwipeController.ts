import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import {Observer} from 'rxjs/Observer';

declare var cordova: any;

function setupIBeacon() {
    var delegate = new cordova.plugins.locationManager.Delegate();

    delegate.didDetermineStateForRegion = function (pluginResult) {
        console.log('didDetermineStateForRegion: ', JSON.stringify(pluginResult));
    };

    delegate.didStartMonitoringForRegion = function (pluginResult) {
        console.log('didStartMonitoringForRegion:', pluginResult);
    };

    delegate.didRangeBeaconsInRegion = function (pluginResult) {
        console.log('[DOM] didRangeBeaconsInRegion: ', JSON.stringify(pluginResult));
    };

    var uuid = 'B9407F30-F5F8-466E-AFF9-25556B57FE6D';
    var identifier = 'beaconOnTheMacBooksShelf';
    var minor = undefined; //53356;
    var major = undefined; //55998;
    var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);

    cordova.plugins.locationManager.setDelegate(delegate);
    cordova.plugins.locationManager.requestAlwaysAuthorization();

    cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
        .fail(function(e) { console.error(e); })
        .done();
}

export class SwipeController {

    public availabilityChanged: Observable<{available: boolean}>;
    private _observer: Observer;
    private _availabilityInfo = { available: false };

    constructor() {
        setupIBeacon();

        this.availabilityChanged = new Observable(observer =>
            this._observer = observer).share();
    }

    public toggleAvailability() {
        this._availabilityInfo = {available: !this._availabilityInfo.available};
        this._observer.next(this._availabilityInfo);
    }

    public getAvailabilityInfo() {
        return this._availabilityInfo;
    }
}