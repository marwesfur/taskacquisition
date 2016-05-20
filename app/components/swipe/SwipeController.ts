import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';
import {TargetContainer} from './TargetContainer';

declare var cordova: any;

function setupIBeacon(ctrl: SwipeController) {
    //var delegate = new cordova.plugins.locationManager.Delegate();
    //
    //var rangingResults = [];
    //
    //delegate.didDetermineStateForRegion = function (pluginResult) {
    //    console.log('didDetermineStateForRegion: ', JSON.stringify(pluginResult));
    //};
    //
    //delegate.didStartMonitoringForRegion = function (pluginResult) {
    //    console.log('didStartMonitoringForRegion:', pluginResult);
    //};
    //
    //delegate.didRangeBeaconsInRegion = function (pluginResult) {
    //    var isImmediate = pluginResult.beacons.length > 0 && (pluginResult.beacons[0].proximity == 'ProximityImmediate');
    //    rangingResults.push(isImmediate);
    //    if (rangingResults.length > 5)
    //        rangingResults.shift();
    //
    //    // todo: add target to controller
    //    //setAvailability(rangingResults.some(_ => _));
    //
    //    console.log('[DOM] didRangeBeaconsInRegion: ', JSON.stringify(pluginResult));
    //};
    //
    //var uuid = 'B9407F30-F5F8-466E-AFF9-25556B57FE6D';
    //var identifier = 'beaconOnTheMacBooksShelf';
    //var minor = undefined; //53356;
    //var major = undefined; //55998;
    //var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);
    //
    //cordova.plugins.locationManager.setDelegate(delegate);
    //cordova.plugins.locationManager.requestAlwaysAuthorization();
    //
    //cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
    //    .fail(function(e) { console.error(e); })
    //    .done();
}

export class SwipeController {

    public targetContainer: TargetContainer;
    public targetsChanged: Observable<any>;

    private _observer: Observer<any>;
    private _targetsInfo = { available: false, targets: [] };

    constructor() {
        setupIBeacon(this);
        this.targetsChanged = new Observable(observer => this._observer = observer).share();
    }

    public addTarget(target) {
        const newTargets = this._targetsInfo.targets.concat([target]);
        this._targetsInfo = {available: newTargets.length > 0, targets: newTargets};
        this.targetContainer.updateTargets(this._targetsInfo);
        this._observer.next(this._targetsInfo);
    }

    public removeTarget(target) {
        const newTargets = this._targetsInfo.targets.filter(_ => _ != target);
        this._targetsInfo = {available: newTargets.length > 0, targets: newTargets};
        this.targetContainer.updateTargets(this._targetsInfo);
        this._observer.next(this._targetsInfo);
    }

    public getAvailabilityInfo() {
        return this._targetsInfo;
    }
}