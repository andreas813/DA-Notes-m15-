import { Injectable, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Firestore, collectionData, collection, doc, DocumentData, onSnapshot } from '@angular/fire/firestore';
import { elementAt, Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface';

@Injectable({
    providedIn: 'root'
})
export class NoteListService {

    // items$: Observable<DocumentData[]>;

    items$;
    items;

    unsubList: any;
    unsubSingle: any;

    firestore = inject(Firestore);

    constructor() {

        this.unsubList = onSnapshot(this.getNotesRef(), (list) => {
            list.forEach(element => {
                console.log(element);
            });
        });

        this.unsubSingle = onSnapshot(this.getSingleDocRef("notes", "r321f2qf2f2f2f"), (element) => { });

        // this.unsubSingle();

        this.items$ = collectionData(this.getNotesRef());
        this.items = this.items$.subscribe((list) => {
            list.forEach(element => {
                console.log(this.setNoteObject(element['data'], element['id']));
            });
        });

        // this.items$ = collectionData(this.getNotesRef());
    }

    setNoteObject(obj: any, id: string): Note {
        return {
            id: id || "",
            type: obj.type || "note",
            title: obj.title || "",
            content: obj.content || "",
            marked: obj.marked || false,
        }
    }

    ngonDestroy() {
        this.unsubList();
        this.items.unsubscribe();

    }

    getNotesRef() {
        return collection(this.firestore, 'notes');
    }

    getTrashRef() {
        return collection(this.firestore, 'trash');
    }

    getSingleDocRef(collectionId: string, docId: string) {
        return doc(collection(this.firestore, collectionId), docId);
    }
}
