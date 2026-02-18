import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { UploadContainer } from '../../components/upload-container/upload-container';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [Sidebar, UploadContainer, NgOptimizedImage],
  templateUrl: './add.html',
  styleUrl: './add.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Add {
  handleFile(file: File) {
    console.log('File received:', file);
    // Qui andrà la logica per gestire il file caricato
  }
}