import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AddQuiz } from './add-quiz';

describe('AddQuiz', () => {
	let component: AddQuiz;
	let fixture: ComponentFixture<AddQuiz>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AddQuiz],
			providers: [provideRouter([])]
		})
		.compileComponents();

		fixture = TestBed.createComponent(AddQuiz);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should keep errorMessage null for a valid pdf under size limit', () => {
		const validPdf = new File(['pdf-content'], 'quiz.pdf', { type: 'application/pdf' });

		component.onFileReceived(validPdf);

		expect(component.errorMessage()).toBeNull();
	});

	it('should set errorMessage for invalid file type', () => {
		const invalidFile = new File(['text-content'], 'notes.txt', { type: 'text/plain' });

		component.onFileReceived(invalidFile);

		expect(component.errorMessage()).toBe('Formato non valido. Carica solo file PDF.');
	});

	it('should set errorMessage for file larger than 10MB', () => {
		const oversizedPdf = {
			size: 10 * 1024 * 1024 + 1,
			type: 'application/pdf',
			name: 'big.pdf'
		} as File;

		component.onFileReceived(oversizedPdf);

		expect(component.errorMessage()).toContain('Il file è troppo grande');
		expect(component.errorMessage()).toContain('Massimo consentito: 10MB');
	});
});
