import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { UploadContainer } from '../upload-container/upload-container';

@Component({
  selector: 'app-add-quiz',
  standalone: true,
  imports: [Sidebar, UploadContainer],
  template: `
    <div class="layout-container">
      
      <app-sidebar class="sidebar-slot" />

      <main class="main-content">
        
        <app-upload-container (fileDropped)="onFileReceived($event)">
          
          <div class="upload-visuals d-flex flex-column align-items-center gap-4">
            <h2 class="upload-title">Aggiungi il tuo .pdf qui</h2>
            
            <div class="robot-wrapper">
               <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="AI Robot" width="120">
            </div>

            <button class="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm pe-none">
              Scegli file
            </button>
          </div>

        </app-upload-container>

        @if (errorMessage()) {
          <div class="alert alert-danger mt-3" role="alert">
            {{ errorMessage() }}
          </div>
        }

      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      background-color: #cffafe; /* Azzurro sfondo come da design */
      overflow: hidden;
    }

    .layout-container {
      display: flex;
      height: 100%;
    }

    /* Gestione spazio Sidebar */
    .sidebar-slot {
      flex-shrink: 0;
    }

    .main-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      padding-left: 140px; /* Offset per non finire sotto la sidebar fissa */
    }

    /* Stile specifico del contenuto proiettato */
    app-upload-container {
      width: 100%;
      max-width: 800px;
      height: 60vh;
      max-height: 600px;
    }

    .upload-title {
      color: #0ea5e9; /* Blu del titolo */
      font-weight: 600;
      font-size: 1.5rem;
    }

    /* Utility per disabilitare eventi pointer sul bottone 
       perché l'evento click è catturato dal padre UploadContainer */
    .pe-none {
      pointer-events: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddQuiz {
  errorMessage = signal<string | null>(null);

  onFileReceived(file: File) {
    this.errorMessage.set(null);

    // 1. Validazione Dimensione (es. 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      this.errorMessage.set(`Il file è troppo grande (${(file.size / 1024 / 1024).toFixed(2)} MB). Massimo consentito: 10MB.`);
      return;
    }

    // 2. Validazione Tipo (ridondante se input ha accept, ma buona pratica)
    if (file.type !== 'application/pdf') {
      this.errorMessage.set('Formato non valido. Carica solo file PDF.');
      return;
    }

    // 3. Procedi con la logica di business
    console.log('File pronto per l\'upload:', file.name);
    // TODO: Chiama il servizio API qui
  }
}