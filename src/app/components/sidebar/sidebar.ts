import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="d-flex flex-column justify-content-between align-items-center py-4 h-100 shadow-sm bg-white rounded-pill">
      
      <div class="nav-group">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link" aria-label="Home">
          <i class="bi bi-house-door-fill fs-4"></i>
        </a>
      </div>

      <div class="nav-group">
        <button type="button" class="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center add-btn" aria-label="Add New">
          <i class="bi bi-plus fs-2"></i>
        </button>
      </div>

      <div class="nav-group">
        <button type="button" class="nav-link border-0 bg-transparent" aria-label="Nuovo">
          <i class="bi-card-text fs-4"></i>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      padding: 1rem;
      width: 110px; 
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
    }

    .nav-link {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #adb5bd;
      transition: all 0.2s ease;

      &:hover {
        color: #0d6efd;
        background-color: #f8f9fa;
      }

      &.active {
        color: #ffffff;
        background-color: #0d6efd;
        box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);
      }
    }

    .add-btn {
      width: 56px;
      height: 56px;
      border-width: 2px;
      &:hover {
        border-color: #0d6efd;
        color: #0d6efd;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar {}