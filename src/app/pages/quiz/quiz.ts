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
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
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