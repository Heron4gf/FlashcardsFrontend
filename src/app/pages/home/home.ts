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

  // ✅ modalità "elimina" + drag state (solo frontend)
  deleteMode = signal(false);
  draggedFileId = signal<number | null>(null);

  private longPressTimer: any = null;
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
            // Rimuove .pdf (case insensitive) + sostituisce _ con spazi
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

  // ===========================
  // ✅ LONG PRESS + TRASH (UI)
  // ===========================

  // Long press start (da collegare nel template a (pointerdown))
  onFolderPointerDown(e: PointerEvent, fileId: number) {
    // evita selezioni/menù contestuale su touch
    if (e.pointerType === 'touch') {
      e.preventDefault();
    }

    this.longPressTriggered = false;

    this.longPressTimer = setTimeout(() => {
      this.longPressTriggered = true;
      this.deleteMode.set(true);
    }, 450);
  }

  // Long press cancel (da collegare nel template a pointerup/cancel/leave)
  onFolderPointerUpOrCancel() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  // Click cartella: se non siamo in deleteMode, apri quiz
  onFolderClick(fileId: number) {
    if (this.longPressTriggered || this.deleteMode()) {
      return;
    }
    this.openQuiz(fileId);
  }

  // Drag start (solo se deleteMode attivo)
  onFolderDragStart(ev: DragEvent, fileId: number) {
    if (!this.deleteMode()) return;

    this.draggedFileId.set(fileId);

    // compatibilità HTML5 DnD
    ev.dataTransfer?.setData('text/plain', String(fileId));
  }

  onFolderDragEnd() {
    this.draggedFileId.set(null);
  }

  // Consentire drop sul cestino
  onTrashDragOver(ev: DragEvent) {
    ev.preventDefault();
  }

  // Drop sul cestino => elimina solo in frontend
  onTrashDrop(ev: DragEvent) {
    ev.preventDefault();

    const fromDt = ev.dataTransfer?.getData('text/plain');
    const id = this.draggedFileId() ?? (fromDt ? Number(fromDt) : null);

    if (typeof id === 'number' && !Number.isNaN(id)) {
      this.files.update(list => list.filter(f => f.id !== id));
    }

    this.draggedFileId.set(null);
    this.deleteMode.set(false);
  }

  // Uscita manuale dalla modalità elimina (overlay click / pulsante)
  exitDeleteMode() {
    this.draggedFileId.set(null);
    this.deleteMode.set(false);
  }

  // ESC per uscire (collega (window:keydown) nel template)
  onKeydown(ev: KeyboardEvent) {
    if (ev.key === 'Escape' && this.deleteMode()) {
      this.exitDeleteMode();
    }
  }
}