import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeago',
  standalone: true
})
export class TimeagoPipe implements PipeTransform {
  transform(value: Date | string | undefined): string {
    if (!value) return '';
    
    const now = new Date();
    const date = typeof value === 'string' ? new Date(value) : value;
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    
    const intervals: { [key: string]: number } = {
      'year': 31536000,
      'month': 2592000,
      'week': 604800,
      'day': 86400,
      'hour': 3600,
      'minute': 60
    };
    
    let counter;
    for (const i in intervals) {
      counter = Math.floor(seconds / intervals[i]);
      if (counter > 0) {
        return counter === 1 ? `${counter} ${i} ago` : `${counter} ${i}s ago`;
      }
    }
    
    return '';
  }
}