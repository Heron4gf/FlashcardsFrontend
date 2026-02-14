import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  template: `
    <div class="scene" [class.flipped]="isFlipped()">
      <div class="card-inner">
        
        <div class="card-face card-front shadow-sm" (click)="flip.emit()">
          <div class="pattern-border d-flex align-items-center justify-content-center h-100 w-100">
            <h3 class="text-center px-4">{{ question() }}</h3>
          </div>
        </div>

        <div class="card-face card-back shadow-sm d-flex flex-column align-items-center justify-content-center">
          <div class="content flex-grow-1 d-flex align-items-center justify-content-center w-100" (click)="flip.emit()">
            <h3 class="text-center px-4 text-white">{{ answer() }}</h3>
          </div>
          
          <div class="actions pb-4 d-flex gap-2">
            <button class="btn btn-light fw-bold" (click)="rate.emit(1)">+1</button>
            <button class="btn btn-light fw-bold" (click)="rate.emit(2)">+2</button>
            <button class="btn btn-light fw-bold" (click)="rate.emit(3)">+3</button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-width: 600px;
      height: 350px;
      perspective: 1000px;
    }

    .scene {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .card-inner {
      width: 100%;
      height: 100%;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
    }

    .scene.flipped .card-inner {
      transform: rotateY(180deg);
    }

    .card-face {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border-radius: 24px;
      background: #ffffff;
      overflow: hidden;
      cursor: pointer;
    }

    .card-front {
      border: 2px solid #e0e0e0;
      padding: 16px;
    }

    .pattern-border {
      border: 4px dashed #5b9bf2;
      border-radius: 16px;
    }

    .card-back {
      background-color: #5b9bf2;
      transform: rotateY(180deg);
      color: white;
    }

    .btn-light {
      min-width: 60px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Flashcard {
  question = input.required<string>();
  answer = input.required<string>();
  isFlipped = input.required<boolean>();
  
  flip = output<void>();
  rate = output<number>();
}