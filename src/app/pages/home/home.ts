import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getAuth } from 'firebase/auth';
import { Sidebar } from '../../components/sidebar/sidebar';
import { UploadContainer } from '../../components/upload-container/upload-container';
import { FolderPreview } from '../../components/folder-preview/folder-preview';

interface FileItem {
  id: number;
  name: string;
  preview: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Sidebar, UploadContainer, NgOptimizedImage, FolderPreview],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit {
  private http = inject(HttpClient);
  
  // Signal con i file dell'utente dal backend
  files = signal<FileItem[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  async ngOnInit() {
    await this.loadFiles();
  }

  async loadFiles() {
    this.loading.set(true);
    this.error.set(null);
    
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      this.error.set('Utente non autenticato');
      this.loading.set(false);
      return;
    }

    try {
      const token = await user.getIdToken();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      this.http.get<FileItem[]>('http://localhost:9090/api/v1/get-files', { headers })
        .subscribe({
          next: (response) => {
            this.files.set(response);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Errore caricamento file:', err);
            this.error.set('Impossibile caricare i file');
            this.loading.set(false);
          }
        });
    } catch (err) {
      this.error.set('Errore di autenticazione');
      this.loading.set(false);
    }
  }

  handleFile(file: File) {
    console.log('File received:', file);
    // Se vuoi anche qui l'upload, copia la logica da add.ts
    // e poi ricarica la lista con this.loadFiles()
  }
}
