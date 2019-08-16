import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class AppService {
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    pageTitle: Subject<string> = new Subject();

    constructor() { }

    setLoadingStatus(isLoading: boolean) {
        this.isLoading.next(isLoading);
    }
}
