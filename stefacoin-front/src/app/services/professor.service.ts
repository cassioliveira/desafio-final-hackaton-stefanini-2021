import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mensagem } from '../models/mensagem';
import { Professor } from '../models/professor';


@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  private readonly URL = `${environment.URL}`;

  constructor(private httpClient: HttpClient) { }

  // #pegabandeira
  listar(): Observable<Professor[]> {
    return this.httpClient.get<Professor[]>(`${this.URL}/professor`);
  }

  obter() { }

  incluir(professor: Professor): Observable<Mensagem> {
    return this.httpClient.post<Mensagem>(`${this.URL}/professor`, professor);
  }

  alterar() { }

  excluir() { }
}
