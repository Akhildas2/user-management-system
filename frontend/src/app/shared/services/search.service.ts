import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({
    providedIn: 'root',
})

export class SearchService {
    private searchQuerySubject = new BehaviorSubject<string>('');// Initial empty search query
    searchQuery$ = this.searchQuerySubject.asObservable();

    // Update the search query
    updateSearchQuery(query: string): void {
        this.searchQuerySubject.next(query);
    }

}