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

  deleteMode = signal(false);
  draggedFileId = signal<string | null>(null);

  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private longPressTriggered = false;

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
            const fullName = file.name
              .replace(/\.pdf$/i, '')
              .replace(/_/g, ' ');

            const displayName =
              fullName.length > 20 ? fullName.substring(0, 20) + '...' : fullName;

            return { ...file, fullName, displayName };
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
    } catch {
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
 
  onFolderPointerDown(e: PointerEvent, fileId: string) {
    // su touch evita long-press menu/scroll selection
    if (e.pointerType === 'touch') {
      e.preventDefault();
    }

    this.longPressTriggered = false;

    this.longPressTimer = setTimeout(() => {
      this.longPressTriggered = true;
      this.deleteMode.set(true);
    }, 450);
  }

  onFolderPointerUpOrCancel() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  onFolderClick(fileId: string) {
    // se long press è attivo o siamo in delete mode, non apre il quiz
    if (this.longPressTriggered || this.deleteMode()) return;
    this.openQuiz(fileId);
  }

  onFolderDragStart(ev: DragEvent, fileId: string) {
    if (!this.deleteMode()) return;

    this.draggedFileId.set(fileId);
    ev.dataTransfer?.setData('text/plain', fileId);
    ev.dataTransfer?.setDragImage?.((ev.target as HTMLElement), 40, 40);
  }

  onFolderDragEnd() {
    this.draggedFileId.set(null);
  }

  onTrashDragOver(ev: DragEvent) {
    ev.preventDefault();
  }

  async deleteFile(id: string) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      this.error.set('Utente non autenticato');
      return;
    }

    try {
      const token = await user.getIdToken();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.delete(`${environment.apiBaseUrl}/files/${id}`, { headers })
        .subscribe({
          next: () => {
            this.files.update(list => list.filter(f => f.id !== id));
          },
          error: () => {
            this.error.set('Impossibile eliminare il file');
          }
        });
    } catch {
      this.error.set('Errore di autenticazione');
    }
  }

  onTrashDrop(ev: DragEvent) {
    ev.preventDefault();

    const fromDt = ev.dataTransfer?.getData('text/plain');
    const id = this.draggedFileId() ?? fromDt ?? null;

    if (id) {
      this.deleteFile(id);
    }

    this.draggedFileId.set(null);
    this.deleteMode.set(false);
  }

  exitDeleteMode() {
    this.draggedFileId.set(null);
    this.deleteMode.set(false);
  }

  onKeydown(ev: KeyboardEvent) {
    if (ev.key === 'Escape' && this.deleteMode()) {
      this.exitDeleteMode();
    }
  }
}