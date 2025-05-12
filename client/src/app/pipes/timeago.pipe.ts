// src/app/pipes/timeago.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeago',
  standalone: true
})
export class TimeagoPipe implements PipeTransform {
  transform(value: Date | string | undefined): string {
    if (!value) return 'never';
    
    // Convert to Date if string
    const date = typeof value === 'string' ? new Date(value) : value;
    const now = new Date();
    
    // Time difference in seconds
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Less than a minute
    if (seconds < 60) {
      return 'just now';
    }
    
    // Less than an hour
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Less than a week
    if (seconds < 604800) {
      const days = Math.floor(seconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    
    // Less than a month
    if (seconds < 2592000) {
      const weeks = Math.floor(seconds / 604800);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    
    // Less than a year
    if (seconds < 31536000) {
      const months = Math.floor(seconds / 2592000);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    
    // More than a year
    const years = Math.floor(seconds / 31536000);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}