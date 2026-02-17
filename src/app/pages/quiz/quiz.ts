import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Flashcard } from '../../components/flashcard/flashcard';

interface CardData {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [Sidebar, Flashcard, RouterLink, NgOptimizedImage],
  template: `
    <div class="container-fluid p-0">
      <app-sidebar />

      <main class="main-content min-vh-100 d-flex flex-column align-items-center justify-content-center p-4">
        
        @if (!quizFinished()) {
          <div class="w-100 d-flex flex-column align-items-center gap-4">
            
            <img ngSrc="assets/robot-icon.png" width="80" height="80" alt="Robot Helper" class="mb-2" />

            <app-flashcard
              [question]="currentCard().question"
              [answer]="currentCard().answer"
              [isFlipped]="isFlipped()"
              (flip)="toggleFlip()"
              (rate)="submitScore($event)"
            />

            <div class="controls w-100 d-flex justify-content-center align-items-center gap-4 mt-4">
              <button 
                class="btn btn-secondary rounded-pill px-4" 
                [disabled]="currentIndex() === 0"
                (click)="prevCard()">
                Indietro
              </button>

              <div class="d-flex gap-2">
                @for (card of cards; track $index) {
                  <div 
                    class="dot" 
                    [class.active]="$index === currentIndex()"
                    [class.completed]="$index < currentIndex()">
                  </div>
                }
              </div>

              <button 
                class="btn btn-primary rounded-pill px-4"
                (click)="nextCard()">
                {{ isLastCard() ? 'Fine' : 'Avanti' }}
              </button>
            </div>
          </div>

        } @else {
          <div class="text-center animate-fade-in">
            <h2 class="text-primary mb-4 fw-bold">Complimenti! Hai completato le flashcard.</h2>
            
            <div class="robot-speech position-relative d-inline-block mb-4">
              <div class="speech-bubble bg-white p-4 rounded-4 shadow-sm mb-3">
                <h4 class="m-0 text-dark">Hai totalizzato {{ totalScore() }}pt</h4>
              </div>
              <img ngSrc="assets/assistant-robot.png" width="200" height="200" alt="Happy Robot" priority />
            </div>

            <div class="mt-4">
              <a routerLink="/" class="btn btn-primary btn-lg rounded-pill px-5">Torna alla Home</a>
            </div>
          </div>
        }

      </main>
    </div>
  `,
  styles: [`
    .main-content {
      padding-left: 110px;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #e0e0e0;
      transition: all 0.3s ease;
      
      &.active {
        background-color: #5b9bf2;
        transform: scale(1.2);
      }
      
      &.completed {
        background-color: #5b9bf2;
        opacity: 0.5;
      }
    }

    .animate-fade-in {
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Quiz {
  // Mock Data
  cards: CardData[] = [
    { question: 'Testo domanda 1', answer: 'Risposta numero 1' },
    { question: 'Quanto fa 2 + 2?', answer: '4' },
    { question: 'Cos\'è Angular?', answer: 'Un framework TypeScript' }
  ];

  currentIndex = signal(0);
  isFlipped = signal(false);
  totalScore = signal(0);
  quizFinished = signal(false);

  currentCard = computed(() => this.cards[this.currentIndex()]);
  isLastCard = computed(() => this.currentIndex() === this.cards.length - 1);

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