export interface CreateActivityRequest{
  name: string,
  description: string,
  startDate: string,
  endDate: string,
  status: string,
  projectId: number,
  idResponsableUser: number
}
