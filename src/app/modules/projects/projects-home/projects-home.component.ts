import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllProjectsResponse } from 'src/app/models/interface/projects/response/GetAllProjectsResponse';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { ProjectsDataTransferService } from 'src/app/shared/services/projects/projects-data-transfer.service';

@Component({
  selector: 'app-projects-home',
  templateUrl: './projects-home.component.html',
  styleUrls: ['./projects-home.component.scss']
})
export class ProjectsHomeComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  public projectsDatas: Array<GetAllProjectsResponse> = []

  constructor(
    private projectsService: ProjectsService,
    private projectsDtService: ProjectsDataTransferService,
    private router: Router,
    private messageService: MessageService
  ){}

  ngOnInit(): void {
    this.getServiceProjectsDatas();
  }

  getServiceProjectsDatas() {
    const projectsLoaded = this.projectsDtService.getProjectsDatas();

    if(projectsLoaded.length > 0){
      this.projectsDatas = projectsLoaded;
    } else {
      this.getAPIProjectsDatas();
    }
  }

  getAPIProjectsDatas() {
    this.projectsService
    .getAllProjects()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if(response.length > 0){
          this.projectsDatas = response
        }
      },
      error: (err) => {
        console.log(err)
        this.messageService.add({
          severity:'Error',
          summary: 'Erro',
          detail: 'Erro ao acessar a Projetos',
          life: 2500,
        })
        this.router.navigate(['/dashboard'])
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
