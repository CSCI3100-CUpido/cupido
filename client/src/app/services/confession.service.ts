import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Confession, ConfessionComment } from '../models/confession.model';

@Injectable({
  providedIn: 'root'
})
export class ConfessionService {
  private apiUrl = `${environment.apiUrl}/confessions`;

  constructor(private http: HttpClient) { }

  getConfessions(): Observable<Confession[]> {
    return this.http.get<Confession[]>(this.apiUrl);
  }

  getConfessionById(id: string): Observable<Confession> {
    return this.http.get<Confession>(`${this.apiUrl}/${id}`);
  }

  createConfession(confession: Partial<Confession>): Observable<Confession> {
    return this.http.post<Confession>(this.apiUrl, confession);
  }

  likeConfession(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/like`, {});
  }

  unlikeConfession(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/like`);
  }

  getComments(confessionId: string): Observable<ConfessionComment[]> {
    return this.http.get<ConfessionComment[]>(`${this.apiUrl}/${confessionId}/comments`);
  }

  addComment(confessionId: string, content: string, isAnonymous: boolean): Observable<ConfessionComment> {
    return this.http.post<ConfessionComment>(`${this.apiUrl}/${confessionId}/comments`, {
      content,
      isAnonymous
    });
  }

  sendPrivateMessage(confessionId: string): Observable<{ chatId: string }> {
    return this.http.post<{ chatId: string }>(`${this.apiUrl}/${confessionId}/message`, {});
  }
}