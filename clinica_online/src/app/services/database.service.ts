import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, docData, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
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

  getPacientes():Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('perfil', '==', 'paciente'));
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

  getTurnos() {
    const collRef = collection(this.firestore, 'turnos');
    const q = query(collRef, orderBy('dia', 'asc'));
    return collectionData(q, {idField:'uid'}) as Observable<any[]>;
  }

  getTurnosByEspecialista(uidEspecialista:string) {
    const turnosRef = collection(this.firestore, 'turnos');
    const q = query(turnosRef, where('uidEspecialista', '==', uidEspecialista), orderBy('dia', 'asc'));
    return collectionData(q, {idField:'uid'}) as Observable<any[]>;
  }

  getTurnosByEspecialistaYFecha(uidEspecialista:string, fecha:string) {
    const turnosRef = collection(this.firestore, 'turnos');
    const q = query(turnosRef, where('uidEspecialista', '==', uidEspecialista), where('dia', '==', fecha), orderBy('dia', 'asc'));
    return collectionData(q, {idField:'uid'}) as Observable<any[]>;
  }

  getTurnosByPaciente(uidPaciente:string) {
    const turnosRef = collection(this.firestore, 'turnos');
    const q = query(turnosRef, where('uidPaciente', '==', uidPaciente), orderBy('dia', 'asc'));
    return collectionData(q, {idField:'uid'}) as Observable<any[]>;
  }

  /*
  addHorariosEspecialista(horarios:any) {
    const docRef = doc(this.firestore, 'horarios', horarios.uid);
    return setDoc(docRef, horarios);  
  }
  */

  updateHorariosEspecialista(horarios:any, uid:string) {
    const docRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(docRef, {horarios: horarios});
  }

  getHorariosEspecialista(uid:string) {
    const userRef = doc(this.firestore, `horarios/${uid}`);
    return docData(userRef, {idField:'uid'});
  }

  addTurno(turno:any) {
    const collRef = collection(this.firestore, 'turnos');
    return addDoc(collRef, turno); 
  }

  updateEstadoTurno(uid:string, estado:string) {
    const docRef = doc(this.firestore, `turnos/${uid}`);
    return updateDoc(docRef, {estado:estado});
  }

  updateComentarioCancelacionTurno(uid:string, comentario:string) {
    const docRef = doc(this.firestore, `turnos/${uid}`);
    return updateDoc(docRef, {comentarioCancelacion:comentario});
  }

  updateComentarioRechazoTurno(uid:string, comentario:string) {
    const docRef = doc(this.firestore, `turnos/${uid}`);
    return updateDoc(docRef, {comentarioRechazo:comentario});
  }

  updateInformeTurno(uid:string, resenia:string, altura:number, peso:number, temperatura:number, presion:number, datos:any[]) {
    const docRef = doc(this.firestore, `turnos/${uid}`);
    return updateDoc(docRef, {resenia:resenia, altura:altura, peso:peso, temperatura:temperatura, presion:presion, datos:datos});
  }

  updateCalificacionTurno(uid:string, comentarioCalificacion:string, calificacion:number) {
    const docRef = doc(this.firestore, `turnos/${uid}`);
    return updateDoc(docRef, {comentarioCalificacion:comentarioCalificacion, calificacion:calificacion});
  }

  updateComentarioEncuesta(uid:string, comentario:string) {
    const docRef = doc(this.firestore, `turnos/${uid}`);
    return updateDoc(docRef, {encuesta:comentario});
  }
}
