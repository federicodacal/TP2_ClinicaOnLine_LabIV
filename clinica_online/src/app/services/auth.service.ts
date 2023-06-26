import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { Firestore, addDoc, collection, doc, docData, serverTimestamp, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData:any = {};

  constructor(private authentication:AngularFireAuth, private firestore:Firestore) { 
    this.userData = this.authentication.authState.pipe(
      switchMap((user: any) => {
        if (user) {
          const userRef = doc(this.firestore, `users/${user.uid}`);
          return docData(userRef, {idField:'uid'}) as Observable<any>;
        } else {
          return of(null);
        }
      })
    );
  }

  async register({email, password, name, lastName, dni, edad, obraSocial, especialidad, perfil, habilitado, imgPerfil, imgSecundaria}:any) {

     try {
      const credential = await this.authentication.createUserWithEmailAndPassword(email, password);

      console.info('credential: ', credential);
      if(credential.user != null) {
        const uid = credential.user?.uid;
  
        const document = doc(this.firestore, `users/${uid}`);

        if(perfil == 'paciente') {
          return setDoc(document, {uid, email, name, lastName, dni, edad, obraSocial, perfil, imgPerfil, imgSecundaria, createdAt:serverTimestamp()});
        }
        else if(perfil == 'especialista') {
          return setDoc(document, {uid, email, name, lastName, dni, edad, especialidad, perfil, habilitado, imgPerfil, createdAt:serverTimestamp()});
        }
      }
    }
    catch(err) {
      console.log('err: ' + err);
      return null;
    }
  }

  async login({email, password}:any) {
    try {
      return await this.authentication.signInWithEmailAndPassword(email, password);
    }
    catch (err:any) {
      console.log('err login', err);
      throw new Error(err);
    }
  }


  logout() {
    return this.authentication.signOut();
  }

  getUser() {
    return this.authentication.authState;
  }
}
