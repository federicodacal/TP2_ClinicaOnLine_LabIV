import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore:Firestore) { }

  getUsers():Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, {idField:'uid'}) as Observable<any[]>;
  }

  getUserByUid(uid:string) {
    const userRef = doc(this.firestore, `users/${uid}`);
    return docData(userRef, {idField:'uid'});
  }

}
