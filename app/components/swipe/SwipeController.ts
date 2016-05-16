import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import {Observer} from 'rxjs/Observer';


export class SwipeController {

    public availabilityChanged: Observable<{available: boolean}>;
    private _observer: Observer;
    private _availabilityInfo = { available: false };

    constructor() {
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