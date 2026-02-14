import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  Auth,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { app } from '../firebase.config';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth | null = null;
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId) && app) {
      this.auth = getAuth(app);
    }
  }

  getCurrentUser(): User | null {
    return this.auth?.currentUser ?? null;
  }

  onAuthStateChanged(callback: (user: User | null) => void): void {
    if (this.auth) {
      onAuthStateChanged(this.auth, callback);
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    if (!this.auth) throw new Error('Auth not initialized');
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async signUp(email: string, password: string): Promise<void> {
    if (!this.auth) throw new Error('Auth not initialized');
    await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async signInWithGoogle(): Promise<void> {
    if (!this.auth) throw new Error('Auth not initialized');
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
  }

  async signOut(): Promise<void> {
    if (!this.auth) throw new Error('Auth not initialized');
    await signOut(this.auth);
  }
}
