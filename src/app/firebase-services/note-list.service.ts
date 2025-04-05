import { Injectable, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Firestore, collectionData, collection, doc, DocumentData, onSnapshot, addDoc, updateDoc, deleteDoc, query, orderBy, limit, where } from '@angular/fire/firestore';
import { elementAt, Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface';
import { isNgTemplate } from '@angular/compiler';

@Injectable({
    providedIn: 'root'
})
export class NoteListService {
    trashNotes: Note[] = [];
    normalNotes: Note[] = [];
    normalMarkedNotes: Note[] = [];
    unsubTrash;
    unsubNotes;
    unsubMarkedNotes;
    firestore = inject(Firestore);

    constructor() {
        this.unsubTrash = this.subTrashList();
        this.unsubNotes = this.subNotesList();
        this.unsubMarkedNotes = this.subMarkedNotesList();
    }

    async deleteNote(colId: "notes" | "trash", docId: string) {
        await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
            (err) => { console.log("Error while deleting note:", err) }
        );
    }

    async updateNote(note: Note) {
        if (note.id) {
            let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
            await updateDoc(docRef, this.getCleanJson(note)).catch(
                (err) => { console.log("Error while updating note:", err) }
            );
        }
    }

    getCleanJson(note: Note) {
        return {
            type: note.type,
            title: note.title,
            content: note.content,
            marked: note.marked,
        }
    }

    getColIdFromNote(note: Note) {
        if (note.type == "note") {
            return "notes"
        }
        else {
            return "trash"
        }
    }

    async addNote(item: Note, colId: "notes" | "trash") {
        if (colId == "notes") {
            await addDoc(this.getNotesRef(), item).catch(
                (err) => { console.error("Error while adding note:", err) }
            ).then(
                (docRef) => { console.log("Document written with ID: ", docRef?.id); }
            )
        }
        else {
            await addDoc(this.getTrashRef(), item).catch(
                (err) => { console.error("Error while adding note:", err) }
            ).then(
                (docRef) => { console.log("Document written with ID: ", docRef?.id); }
            )
        }
    }

    ngonDestroy() {
        this.unsubTrash();
        this.unsubNotes();
        this.unsubMarkedNotes();
    }

    subTrashList() {
        return onSnapshot(this.getTrashRef(), (list) => {
            this.trashNotes = [];
            list.forEach(element => {
                this.trashNotes.push(this.setNoteObject(element.data(), element.id));
            });
        });
    }

    subNotesList() {
        const q = query(this.getNotesRef());
        return onSnapshot(q, (list) => {
            this.normalNotes = [];
            list.forEach(element => {
                this.normalNotes.push(this.setNoteObject(element.data(), element.id));
            });
        });
    }

    subMarkedNotesList() {
        const q = query(this.getNotesRef(), where("marked", "==", true));
        return onSnapshot(q, (list) => {
            this.normalMarkedNotes = [];
            list.forEach(element => {
                this.normalMarkedNotes.push(this.setNoteObject(element.data(), element.id));
            });
        });
    }

    setNoteObject(obj: any, id: string): Note {
        return {
            id: id,
            type: obj.type || "note",
            title: obj.title || "",
            content: obj.content || "",
            marked: obj.marked || false,
        }
    }

    getNotesRef() {
        return collection(this.firestore, 'notes');
    }

    getTrashRef() {
        return collection(this.firestore, 'trash');
    }

    getSingleDocRef(collectionId: string, documentId: string) {
        return doc(collection(this.firestore, collectionId), documentId);
    }
}
