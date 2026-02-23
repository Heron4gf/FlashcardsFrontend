import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { Sidebar } from '../../components/sidebar/sidebar';
import { UploadContainer } from '../../components/upload-container/upload-container';
import { environment } from '../../environments/environment.local';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [Sidebar, UploadContainer, NgOptimizedImage],
  templateUrl: './add.html',
  styleUrl: './add.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Add {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // Signals per lo stato
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  async handleFile(file: File) {
    // Reset stato
    this.errorMessage.set(null);
    this.loading.set(true);
    
    const formData = new FormData();
    formData.append('name', file.name);
    formData.append('file', file);

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      this.errorMessage.set('Errore: utente non autenticato');
      this.loading.set(false);
      return;
    }

    try {
      const token = await user.getIdToken();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.post(`${environment.apiBaseUrl}/files`, formData, { headers })
        .subscribe({
          next: (response) => {
            console.log('Upload ok:', response);
            this.loading.set(false);
            // Naviga alla home in caso di successo (201 Created)
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error(error);
            this.loading.set(false);
            // Estrae il messaggio di errore dal backend o usa uno default
            const msg = error.error?.detail || error.message || 'Errore durante il caricamento';
            this.errorMessage.set(msg);
          }
        });
    } catch (err) {
      this.loading.set(false);
      this.errorMessage.set('Errore durante l\'autenticazione');
    }
  }
}
