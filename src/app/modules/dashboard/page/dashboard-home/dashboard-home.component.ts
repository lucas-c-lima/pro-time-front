import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GetAllProjectsResponse } from 'src/app/models/interface/projects/response/GetAllProjectsResponse';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { ProjectsDataTransferService } from 'src/app/shared/services/projects/projects-data-transfer.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  // TODO apagar caso não precise mudar estilos (quase impossivel mas né)
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit{
  public projectsList: Array<GetAllProjectsResponse> = []

  constructor(
    private projectsService: ProjectsService,
    private messageService: MessageService,
    private projectsDtService: ProjectsDataTransferService
  ){}

  ngOnInit(): void {
      this.getProjectsDatas();
  }

  getProjectsDatas(): void {
    this.projectsService
    .getAllProjects()
    .subscribe({
      next: (response) => {
        if (response.length > 0){
          this.projectsList = response;
          this.projectsDtService.setProjectsDatas(this.projectsList);
        }
      }, error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar projetos!',
          life: 2500
        })
      }
    })
  }
}
