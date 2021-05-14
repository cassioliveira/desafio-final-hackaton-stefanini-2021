import { ProfessorService } from './../../../services/professor.service';
import { Component, OnInit } from '@angular/core';
import { Professor } from 'src/app/models/professor';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  professor: any;
  professores: Array<Professor> = [];

  constructor(private professorService: ProfessorService) { }

  ngOnInit(): void {
    this.professorService.listar().subscribe(professor =>{
      console.log(professor);
      this.professor = professor;
    });
  }

}

function logout() {
  this.authService.logout();
}
