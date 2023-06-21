import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of, switchMap } from 'rxjs';
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
    )
  }

  async register({email, password, name}:any) {

     try {
      const credential = await this.authentication.createUserWithEmailAndPassword(email, password);

      console.info('credential: ', credential);
      if(credential.user != null) {
        const uid = credential.user?.uid;
  
        const document = doc(this.firestore, `users/${uid}`);
        return setDoc(document, {uid, email, name, createdAt:serverTimestamp()});
      }
    }
    catch(err) {
      console.log('err: ' + err);
      return null;
    }
  }

  async login({email, password}:any) {
    return this.authentication.signInWithEmailAndPassword(email, password);
  }


  logout() {
    return this.authentication.signOut();
  }

  getUser() {
    return this.authentication.authState;
  }
}
