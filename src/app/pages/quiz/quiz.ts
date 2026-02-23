import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgOptimizedImage } from '@angular/common';
import { getAuth } from 'firebase/auth';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Flashcard } from '../../components/flashcard/flashcard';
import { environment } from '../../environments/environment.local';

interface CardData {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [Sidebar, Flashcard, RouterLink, NgOptimizedImage],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Quiz implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  
  fileId = signal<string | null>(null);
  cards = signal<CardData[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  
  currentIndex = signal(0);
  isFlipped = signal(false);
  totalScore = signal(0);
  quizFinished = signal(false);

  currentCard = computed(() => this.cards()[this.currentIndex()]);
  isLastCard = computed(() => this.currentIndex() === this.cards().length - 1);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('fileId');
    if (!id) {
      this.error.set('ID file non valido');
      this.loading.set(false);
      return;
    }
    
    this.fileId.set(id);
    await this.loadFlashcards(id);
  }

  async loadFlashcards(id: string) {
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
      
      this.http.post<CardData[]>(
        `${environment.apiBaseUrl}/files/${id}/flashcards`,
        { limit: 20 },
        { headers }
      ).subscribe({
        next: (response) => {
          this.cards.set(response);
          this.loading.set(false);
          
          if (response.length === 0) {
            this.error.set('Nessuna flashcard trovata per questo file');
          }
        },
        error: (err) => {
          console.error('Errore caricamento flashcard:', err);
          this.error.set(err.error?.detail || 'Errore nel caricamento delle flashcard');
          this.loading.set(false);
        }
      });
    } catch (err) {
      this.error.set('Errore di autenticazione');
      this.loading.set(false);
    }
  }

  toggleFlip() {
    this.isFlipped.update(v => !v);
  }

  submitScore(points: number) {
    this.totalScore.update(s => s + points);
    this.nextCard();
  }

  nextCard() {
    if (this.isLastCard()) {
      this.quizFinished.set(true);
    } else {
      this.isFlipped.set(false);
      this.currentIndex.update(i => i + 1);
    }
  }

  prevCard() {
    if (this.currentIndex() > 0) {
      this.isFlipped.set(false);
      this.currentIndex.update(i => i - 1);
    }
  }
}
