import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import {Observer} from 'rxjs/Observer';

declare var cordova: any;

function setupIBeacon(setAvailability: (boolean) => void) {
    return;

    if (!cordova || !cordova.plugins)
        return;

    var delegate = new cordova.plugins.locationManager.Delegate();

    var rangingResults = [];

    delegate.didDetermineStateForRegion = function (pluginResult) {
        console.log('didDetermineStateForRegion: ', JSON.stringify(pluginResult));
    };

    delegate.didStartMonitoringForRegion = function (pluginResult) {
        console.log('didStartMonitoringForRegion:', pluginResult);
    };

    delegate.didRangeBeaconsInRegion = function (pluginResult) {
        var isImmediate = pluginResult.beacons.length > 0 && (pluginResult.beacons[0].proximity == 'ProximityImmediate');
        rangingResults.push(isImmediate);
        if (rangingResults.length > 5)
            rangingResults.shift();

        setAvailability(rangingResults.some(_ => _));

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

const targets = [
    {name: 'VIP', id: 'vip'},
    {name: 'Mülleimer', id: 'trash'}
];

export class SwipeController {

    public availabilityChanged: Observable<{available: boolean}>;
    private _observer: Observer;
    private _availabilityInfo = { available: false };
    public determineTarget;

    constructor() {
        setupIBeacon(_ => this.setAvailability(_));

        this.availabilityChanged = new Observable(observer =>
            this._observer = observer).share();
    }

    public setAvailability(available: boolean) {
        if (this._availabilityInfo.available == available)
            return;

        this._availabilityInfo = {available: available, targets: available ? targets : []};
        this._observer.next(this._availabilityInfo);
    }

    public toggleAvailability() {
        this._availabilityInfo = {available: !this._availabilityInfo.available, targets: !this._availabilityInfo.available ? targets : []};
        this._observer.next(this._availabilityInfo);
    }

    public getAvailabilityInfo() {
        return this._availabilityInfo;
    }

    public moving(center, angle) {
        this.determineTarget(center, angle);
    }
}