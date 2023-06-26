import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, query, updateDoc, where } from '@angular/fire/firestore';
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

  updateStatusSpecialist(uid:string, accion:string) {
    const usrRef = doc(this.firestore, `users/${uid}`);
    if(accion == 'habilitar') {
      return updateDoc(usrRef, {habilitado:true});
    }
    else if(accion == 'deshabilitar') {
      return updateDoc(usrRef, {habilitado:false});
    }
    return null;
  }

}
