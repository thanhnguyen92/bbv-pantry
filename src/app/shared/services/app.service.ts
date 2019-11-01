import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class AppService {
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    pageTitle: Subject<string> = new Subject();

    // Private
    private loadingTimeout = 10000;
    private timer;

    constructor() { }

    setLoadingStatus(isLoading: boolean) {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        if (isLoading) {
            this.timer = setTimeout(() => this.isLoading.next(false), this.loadingTimeout);
        }
        this.isLoading.next(isLoading);
    }

    get loadingState() {
        return this.isLoading.value;
    }
}
