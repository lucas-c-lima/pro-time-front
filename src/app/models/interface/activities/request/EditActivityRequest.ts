export interface EditActivityRequest{
  id: number,
  name: string,
  description: string,
  startDate: string,
  endDate: string,
  status: string,
  idProjects: number,
  idResponsableUser: number
}
