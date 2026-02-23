import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { Sidebar } from '../../components/sidebar/sidebar';
import { UploadContainer } from '../../components/upload-container/upload-container';
import { FolderPreview } from '../../components/folder-preview/folder-preview';
import { environment } from '../../environments/environment.local';

interface FileItem {
  id: string;
  name: string;
  preview: string;
  displayName: string; // nome troncato per UI
  fullName: string;    // nome completo per hover
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
  private router = inject(Router);
  
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
      
      this.http.get<Omit<FileItem, 'displayName' | 'fullName'>[]>(
        `${environment.apiBaseUrl}/files`,
        { headers }
      )
      .subscribe({
        next: (response) => {

          const formattedFiles: FileItem[] = response.map(file => {

            // Rimuove .pdf (case insensitive)
            const fullName = file.name
              .replace(/\.pdf$/i, '')
              .replace(/_/g, ' ');

            // Tronca a 20 caratteri
            const displayName =
              fullName.length > 20
                ? fullName.substring(0, 20) + '...'
                : fullName;

            return {
              ...file,
              fullName,
              displayName
            };
          });

          this.files.set(formattedFiles);
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

  openQuiz(fileId: string) {
    this.router.navigate(['/quiz', fileId]);
  }

  handleFile(file: File) {
    console.log('File received:', file);
  }
}