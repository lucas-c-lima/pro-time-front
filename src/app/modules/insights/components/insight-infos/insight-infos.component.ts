import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { Subject, takeUntil } from 'rxjs';
import { GetAllActivitiesResponse } from 'src/app/models/interface/activities/response/GetAllActivitiesResponse';
import { GetAllEntriesResponse } from 'src/app/models/interface/hours/response/GetAllEntriesResponse';
import { GetAllProjectsResponse } from 'src/app/models/interface/projects/response/GetAllProjectsResponse';
import { GetAllUsersResponse } from 'src/app/models/interface/users/response/GetAllUsersResponse';
import { ActivitiesService } from 'src/app/services/activities/activities.service';
import { HoursService } from 'src/app/services/hours/hours.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-insight-infos',
  templateUrl: './insight-infos.component.html',
  styleUrls: ['./insight-infos.component.scss']
})
export class InsightInfosComponent implements OnInit{
  private readonly destroy$: Subject<void> = new Subject();
  public activities: Array<GetAllActivitiesResponse> = [];
  public projects: Array<GetAllProjectsResponse> = [];
  public users: Array<GetAllUsersResponse> = [];
  public hours: Array<GetAllEntriesResponse> = [];

  timePeriod: string[] = [
    'Última semana',
    'Último mês',
    'Últimos 3 meses',
    'Último ano',
    'Tempo todo'
  ]

  selectedFilter: string = 'Tempo todo';
  filteredActivities: Array<GetAllActivitiesResponse> = [];
  filteredProjects: Array<GetAllProjectsResponse> = [];
  filteredUsers: Array<GetAllUsersResponse> = [];
  filteredHours: Array<GetAllEntriesResponse> = [];

  public filteredNumber: number = 0
  public finishedActivities: number = 0
  public onGoingActivities: number = 0
  public lateActivities: number = 0

  public activitiesChartDatas!: ChartData;
  public activitiesChartOptions!: ChartOptions;

  public activitiesDonutChartDatas!: ChartData;
  public activitiesDonutChartOptions!: ChartOptions;

  public hoursLineChartDatas!: ChartData;
  public hoursLineChartOptions!: ChartOptions;

  public projectsDonutChartDatas!: ChartData;
  public projectsDonutChartOptions!: ChartOptions;

  constructor(
    private activitiesService: ActivitiesService,
    private projectsService: ProjectsService,
    private userService: UserService,
    private hoursService: HoursService,
    private datePipe: DatePipe,
  ){
  }

  ngOnInit(): void {
    this.loadHours()
    this.loadProjects()
    this.loadActivities()
    this.loadUsers()
  }

  // LOADS ------------------------
  loadActivities(): void {
    this.activitiesService.getAllActivities().pipe(takeUntil(this.destroy$)).subscribe((activities) => {
      this.activities = activities;
      this.updateActivityCounts()
      this.onFilterChange()
    });
  }
  loadProjects(): void{
    this.projectsService.getAllProjects().pipe(takeUntil(this.destroy$)).subscribe((projects) => {
      this.projects = projects;
    });
  }
  loadUsers(): void{
    this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe((users) => {
      this.users = users;
    });
  }
  loadHours(): void{
    this.hoursService.getAllHours().pipe(takeUntil(this.destroy$)).subscribe((hours) => {
      this.hours = hours;
    });
  }


  // Filters -----------------------

  updateActivityCounts(): void {
    this.finishedActivities = this.activities.filter(activity => activity.status === 'CONCLUIDA').length;
    this.onGoingActivities = this.activities.filter(activity => activity.status === 'EM_ANDAMENTO').length;
    this.lateActivities = this.activities.filter(activity => {
        if(activity.endDate !== null){
          const activityDate = this.convertToISO(activity.endDate)
          const activityDateC = this.convertToISO(activity.creationDate)
          return activityDate < new Date() && activityDateC >= new Date(0)
        } else {
          return false
        }
    }).length;
    this.filteredNumber = this.activities.filter(activity => {
      if(activity.creationDate !== null){
        const activityDate = this.convertToISO(activity.creationDate);
        return activityDate < new Date();
      } else {
        return false
      }
    }).length

  }

  onFilterChange(){
    const today = new Date();
    let startDate: Date;

    switch (this.selectedFilter) {
      case 'Última semana':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case 'Último mês':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'Últimos 3 meses':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 3);
        break;
      case 'Último ano':
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      case 'Tempo todo':
        startDate = new Date(0);
        break;
      default:
        startDate = new Date(0);
        break;
    }

    this.filteredActivities = this.activities.filter(activity => {
      if(activity.creationDate !== null){
        const activityDate = this.convertToISO(activity.creationDate);
        return activityDate >= startDate;
      } else {
        return false
      }
    });

    this.finishedActivities = this.filteredActivities.filter(activity => activity.status === 'CONCLUIDA').length
    this.onGoingActivities = this.filteredActivities.filter(activity => activity.status === 'EM_ANDAMENTO').length
    this.lateActivities = this.activities.filter(activity => {
      if(activity.endDate !== null){
        const activityDate = this.convertToISO(activity.endDate)
        const activityDateC = this.convertToISO(activity.creationDate)
        return activityDate < new Date() && activityDateC >= startDate
      } else {
        return false
      }
    }).length
    this.filteredNumber = this.filteredActivities.length

    this.filteredHours = this.hours.filter(entry => {
      const startDateEntry = this.convertToISO(entry.startDate);
      const endDateEntry = this.convertToISO(entry.endDate);
      return startDateEntry >= startDate || endDateEntry >= startDate;
    });

    console.log(this.projects)
    this.filteredProjects = this.projects.filter(project => {
      if (project.creationDate !== null) {
        const projectDate = this.convertToISO(project.creationDate);
        return projectDate >= startDate;
      } else {
        return false;
      }
    });



    this.setActivitiesChartConfig();
    this.setActivitiesDonutChartConfig()
    this.setHoursLineChartConfig()
    this.setProjectsDonutChartConfig()
  }


  // Configs ------------------------
  setActivitiesChartConfig(): void {
    if (this.filteredActivities.length > 0) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--text-color-secondary'
      );
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      const incompleteCounts: Record<string, number> = this.filteredActivities.reduce((acc, activity) => {
        if (activity.status !== 'CONCLUIDA') {
          const projectId = activity.projectId.name;
          acc[projectId] = (acc[projectId] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
      const projectNames = Object.keys(incompleteCounts);
      const counts = Object.values(incompleteCounts);
      const maxCount = Math.max(0, ...counts) + 1;


      this.activitiesChartDatas = {
        labels: projectNames,
        datasets: [
          {
            label: 'Atividades por concluir',
            backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
            borderColor: documentStyle.getPropertyValue('--indigo-400'),
            hoverBackgroundColor:
              documentStyle.getPropertyValue('--indigo-500'),
            data: counts,
          },
        ],
      };

      this.activitiesChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
          title: {
            display: true,
            text: 'Título do Gráfico',
            align: 'start'
          }
        },

        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500,
              },
            },
            grid: {
              color: surfaceBorder,
              drawOnChartArea: false,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
            title:{
              display: true,
              text: 'Número de atividades'
            },
            min: 0,
            max: maxCount,
          },
        },
      };
    }
  }

  setActivitiesDonutChartConfig(): void {
    if (this.filteredActivities.length > 0) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      // Contagem de atividades por status
      const statusCounts: Record<string, number> = this.filteredActivities.reduce((acc, activity) => {
        acc[activity.status] = (acc[activity.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statuses = Object.keys(statusCounts);
      const counts = Object.values(statusCounts);

      this.activitiesDonutChartDatas = {
        labels: statuses,
        datasets: [
          {
            label: 'Atividades por Status',
            backgroundColor: [
              documentStyle.getPropertyValue('--indigo-400'),
              documentStyle.getPropertyValue('--green-400'),
              documentStyle.getPropertyValue('--red-400'),
              documentStyle.getPropertyValue('--orange-400'),
            ],
            data: counts,
          },
        ],
      };

      this.activitiesDonutChartOptions = {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
          title: {
            display: true,
            text: 'Atividades Totais por Status de Conclusão', // Título do gráfico
            color: textColor,
            font: {
              size: 20,
            },
          },
        },
      };
    }
  }

  setHoursLineChartConfig(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    const hoursByUser: Record<string, number> = {};

    // Calcular horas totais por usuário
    this.filteredHours.forEach(entry => {
      const userName = entry.idUsers.name;
      const startDate = this.convertToISO(entry.startDate); // Data de início
      const endDate = this.convertToISO(entry.endDate); // Data de fim

      // Calcular horas trabalhadas
      const hoursWorked = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60); // Conversão para horas

      // Somar as horas ao usuário correspondente
      if (!hoursByUser[userName]) {
        hoursByUser[userName] = 0;
      }
      hoursByUser[userName] += hoursWorked; // Soma total de horas
    });

    // Criar dados para o gráfico
    const labels = Object.keys(hoursByUser); // Usuários como labels
    const data = Object.values(hoursByUser); // Horas totais como dados

    this.hoursLineChartDatas = {
      labels: labels,
      datasets: [
        {
          label: 'Horas Totais Lançadas',
          data: data,
          fill: true,
          backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
          tension: 0.1,
        },
      ],
    };

    this.hoursLineChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
        title: {
          display: true,
          text: 'Horas Totais Lançadas por Usuário',
          color: textColor,
          font: {
            size: 20,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawOnChartArea: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
          title: {
            display: true,
            text: 'Horas',
          },
          min: 0,
        },
      },
    };
  }

  setProjectsDonutChartConfig(): void {
    if (this.filteredProjects.length > 0) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      // Contagem de projetos por status
      const statusCounts: Record<string, number> = this.filteredProjects.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statuses = Object.keys(statusCounts);
      const counts = Object.values(statusCounts);

      this.projectsDonutChartDatas = {
        labels: statuses,
        datasets: [
          {
            label: 'Projetos por Status',
            backgroundColor: [
              documentStyle.getPropertyValue('--indigo-400'),
              documentStyle.getPropertyValue('--green-400'),
              documentStyle.getPropertyValue('--red-400'),
              documentStyle.getPropertyValue('--orange-400'),
            ],
            data: counts,
          },
        ],
      };

      this.projectsDonutChartOptions = {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
          title: {
            display: true,
            text: 'Projetos Totais por Status', // Título do gráfico
            color: textColor,
            font: {
              size: 20,
            },
          },
        },
      };
    }
  }


  private convertToISO(dateString: string): Date {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart.split(':');

    const isoString = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;

    return new Date(isoString);
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
