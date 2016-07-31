import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';
import {TargetContainer} from './TargetContainer';

declare var cordova: any;

export class SwipeController {

    public targetContainer: TargetContainer;
    public targetsChanged: Observable<any>;

    private _observer: Observer<any>;
    private _targetsInfo = { available: false, targets: [] };

    constructor() {
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