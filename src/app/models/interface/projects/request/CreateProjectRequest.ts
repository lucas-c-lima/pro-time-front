export interface CreateProjectRequest{
  name: string,
  description: string,
  startDate: string,
  endDate: string,
  status: string,
  idResponsableUser: number,
  priority: string
}
