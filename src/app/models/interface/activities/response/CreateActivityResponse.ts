export interface CreateActivityResponse{
  id: number,
  name: string,
  description: string,
  startDate: string,
  endDate: string,
  status: string,
  idProject: number,
  idResponsableUser: number
}
