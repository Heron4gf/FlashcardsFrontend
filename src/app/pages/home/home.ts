import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { UploadContainer } from '../../components/upload-container/upload-container';
import { FolderPreview } from '../../components/folder-preview/folder-preview';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Sidebar, UploadContainer, NgOptimizedImage, FolderPreview],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {

  folders = Array.from({ length: 100 }, (_, i) => ({
    label: `Cartella ${i + 1}`,
    previewText: `Anteprima contenuto della cartella numero ${i + 1}...`
  }));

  handleFile(file: File) {
    console.log('File received:', file);
  }
}