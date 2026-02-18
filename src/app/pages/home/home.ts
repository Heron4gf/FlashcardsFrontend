import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { UploadContainer } from '../../components/upload-container/upload-container';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Sidebar, UploadContainer, NgOptimizedImage],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  handleFile(file: File) {
    console.log('File received:', file);
  }
}