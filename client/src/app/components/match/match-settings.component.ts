// src/app/components/match/match-settings.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatchingService, MatchingPreference } from '../../services/matching.service';

@Component({
  selector: 'app-match-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './match-settings.component.html',
  styleUrls: ['./match-settings.component.css']
})
export class MatchSettingsComponent implements OnInit {
  settingsForm!: FormGroup;
  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  // Available interests for selection
  allInterests = [
    'Sports', 'Movies', 'Music', 'Reading', 'Art', 'Gaming',
    'Cooking', 'Travel', 'Photography', 'Technology', 'Hiking',
    'Dancing', 'Writing', 'Fashion', 'Fitness', 'Programming',
    'Basketball', 'Swimming', 'Marketing', 'Social Media',
    'Literature', 'Arts', 'Languages', 'Biology', 'Physics',
    'Guitar', 'Astronomy', 'Environmental Protection'
  ];
  
  // Campus options
  campuses = ['CUHK', 'HKU', 'HKUST', 'PolyU', 'CityU', 'HKBU', 'LingU', 'EdUHK'];
  
  constructor(
    private matchingService: MatchingService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserPreferences();
  }
  
  initializeForm(): void {
    this.settingsForm = this.formBuilder.group({
      minAge: [18, [Validators.required, Validators.min(18), Validators.max(50)]],
      maxAge: [30, [Validators.required, Validators.min(18), Validators.max(50)]],
      genderPreference: this.formBuilder.group({
        male: [true],
        female: [true],
        other: [true]
      }),
      interests: [[]],
      campusPreference: [[]]
    });
  }
  
  loadUserPreferences(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.matchingService.getUserPreferences().subscribe({
      next: (preferences) => {
        this.updateFormFromPreferences(preferences);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading preferences', error);
        this.errorMessage = 'Failed to load preferences. Please try again.';
        this.isLoading = false;
      }
    });
  }
  
  updateFormFromPreferences(preferences: MatchingPreference): void {
    const genderPrefs = preferences.genderPreference || [];
    
    this.settingsForm.patchValue({
      minAge: preferences.minAge || 18,
      maxAge: preferences.maxAge || 30,
      genderPreference: {
        male: genderPrefs.includes('male'),
        female: genderPrefs.includes('female'),
        other: genderPrefs.includes('other')
      },
      interests: preferences.interests || [],
      campusPreference: preferences.campusPreference || ['CUHK']
    });
  }
  
  savePreferences(): void {
    if (this.settingsForm.invalid) {
      this.markFormGroupTouched(this.settingsForm);
      return;
    }
    
    this.isSaving = true;
    this.errorMessage = null;
    this.successMessage = null;
    
    const formValues = this.settingsForm.value;
    const genderPreference: string[] = [];
    
    if (formValues.genderPreference.male) genderPreference.push('male');
    if (formValues.genderPreference.female) genderPreference.push('female');
    if (formValues.genderPreference.other) genderPreference.push('other');
    
    const preferences: MatchingPreference = {
      minAge: formValues.minAge,
      maxAge: formValues.maxAge,
      genderPreference,
      interests: formValues.interests,
      campusPreference: formValues.campusPreference
    };
    
    this.matchingService.updateUserPreferences(preferences).subscribe({
      next: (updatedPreferences) => {
        this.updateFormFromPreferences(updatedPreferences);
        this.isSaving = false;
        this.successMessage = 'Preferences saved successfully!';
        
        // Clear success message after a delay
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error) => {
        console.error('Error saving preferences', error);
        this.errorMessage = 'Failed to save preferences. Please try again.';
        this.isSaving = false;
      }
    });
  }
  
  resetForm(): void {
    this.loadUserPreferences();
  }
  
  isInterestSelected(interest: string): boolean {
    const selectedInterests = this.settingsForm.get('interests')?.value || [];
    return selectedInterests.includes(interest);
  }
  
  toggleInterest(interest: string): void {
    const selectedInterests = [...(this.settingsForm.get('interests')?.value || [])];
    const index = selectedInterests.indexOf(interest);
    
    if (index === -1) {
      selectedInterests.push(interest);
    } else {
      selectedInterests.splice(index, 1);
    }
    
    this.settingsForm.patchValue({ interests: selectedInterests });
  }
  
  isCampusSelected(campus: string): boolean {
    const selectedCampuses = this.settingsForm.get('campusPreference')?.value || [];
    return selectedCampuses.includes(campus);
  }
  
  toggleCampus(campus: string): void {
    const selectedCampuses = [...(this.settingsForm.get('campusPreference')?.value || [])];
    const index = selectedCampuses.indexOf(campus);
    
    if (index === -1) {
      selectedCampuses.push(campus);
    } else {
      selectedCampuses.splice(index, 1);
    }
    
    this.settingsForm.patchValue({ campusPreference: selectedCampuses });
  }
  
  // Handle age range input changes
  onMinAgeChange(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.settingsForm.patchValue({ minAge: value });
    
    // Ensure maxAge is not less than minAge
    const maxAge = this.settingsForm.get('maxAge')?.value;
    if (maxAge < value) {
      this.settingsForm.patchValue({ maxAge: value });
    }
  }
  
  onMaxAgeChange(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.settingsForm.patchValue({ maxAge: value });
    
    // Ensure minAge is not greater than maxAge
    const minAge = this.settingsForm.get('minAge')?.value;
    if (minAge > value) {
      this.settingsForm.patchValue({ minAge: value });
    }
  }
  
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}