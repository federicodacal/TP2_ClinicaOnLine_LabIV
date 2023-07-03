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

  getEspecialistas():Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('perfil', '==', 'especialista'));
    return collectionData(q, {idField:'uid'}) as Observable<any[]>;
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

  getTurnosByEspecialista(uidEspecialista:string) {
    const turnosRef = collection(this.firestore, 'turnos');
    const q = query(turnosRef, where('uidEspecialista', '==', uidEspecialista));
    return collectionData(q, {idField:'uid'}) as Observable<any[]>;
  }

  /*
  addHorariosEspecialista(horarios:any) {
    const docRef = doc(this.firestore, 'horarios', horarios.uid);
    return setDoc(docRef, horarios);  
  }
  */

  updateHorariosEspecialista(horarios:any) {
    const docRef = doc(this.firestore, `users/${horarios.uid}`);
    return updateDoc(docRef, {horarios: horarios});
  }

  getHorariosEspecialista(uid:string) {
    const userRef = doc(this.firestore, `horarios/${uid}`);
    return docData(userRef, {idField:'uid'});
  }

}
