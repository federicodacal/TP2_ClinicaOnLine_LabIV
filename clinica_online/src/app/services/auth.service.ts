import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { Firestore, addDoc, collection, doc, docData, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { ToastService } from './toast.service';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  admin:boolean=false;
  userData:any = {};

  constructor(private authentication:AngularFireAuth, private firestore:Firestore, private toast:ToastService, private db:DatabaseService) { 
    this.userData = this.authentication.authState.pipe(
      switchMap((user: any) => {
        if (user) {
          const userRef = doc(this.firestore, `users/${user.uid}`);
          return docData(userRef, {idField:'uid'}) as Observable<any>;
        } 
        else {
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

        await credential.user.sendEmailVerification().then(async () => {
          console.log('email enviado');

          await this.logout();

          if(perfil == 'paciente') {
            return setDoc(document, {uid, email, name, lastName, dni, edad, obraSocial, perfil, imgPerfil, imgSecundaria, createdAt:serverTimestamp()});
          }
          else if(perfil == 'especialista') {
            return setDoc(document, {uid, email, name, lastName, dni, edad, especialidad, perfil, habilitado, imgPerfil, createdAt:serverTimestamp()});
          }
          else if(perfil == 'administrador') {
            return setDoc(document, {uid, email, name, lastName, dni, edad, perfil, habilitado, imgPerfil, createdAt:serverTimestamp()});
          }
          else {
            return null;
          }
          
        })
        .catch((err) => {
          this.toast.showError('Ocurrió un problema');
          console.log('err email', err);
          throw new Error(err);
        });
      }
    }
    catch(err:any) {
      console.log('err: ' + err);
      throw new Error(err);
      //return null;
    }   
  }

  async login({email, password}:any) {
    try {
      //return await this.authentication.signInWithEmailAndPassword(email, password);
      this.authentication.signInWithEmailAndPassword(email, password).then((res:any) => {

        console.log('res en login', res.user.uid);

        this.db.getUserByUid(res.user.uid).subscribe((user:any) => {

          console.log(user);

          if(user.perfil == 'administrador') {
            this.admin = true;
          }
        });
      });
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
