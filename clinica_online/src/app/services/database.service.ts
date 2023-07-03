import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, docData, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
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

  getTurnos() {
    const turnosRef = collection(this.firestore, 'turnos');
    return collectionData(turnosRef, {idField:'uid'}) as Observable<any[]>;
  }

  addHorariosEspecialista(horarios:any) {
    const docRef = doc(this.firestore, 'horarios', horarios.uid);
    return setDoc(docRef, horarios);  
  }

  updateHorariosEspecialista(horarios:any) {
    const docRef = doc(this.firestore, `horarios/${horarios.uid}`);
    return updateDoc(docRef, horarios);
  }

  getHorariosEspecialista(uid:string) {
    const userRef = doc(this.firestore, `horarios/${uid}`);
    return docData(userRef, {idField:'uid'});
  }

}
