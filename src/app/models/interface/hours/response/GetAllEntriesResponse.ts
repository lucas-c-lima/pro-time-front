export interface GetAllEntriesResponse{
  id: number,
  idActivities: {
    id: number;
    projectId: {
      id: number;
      name: string;
      description: string;
      startDate: string;
      endDate: string;
      status: string;
      idResponsableUser: {
        id: number;
        name: string;
        email: string;
        password: string;
        profile: string;
        creationDate: string;
        lastLogin: string;
      };
      creationDate: string;
      priority: string;
    }
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    idResponsableUser: {
      id: number;
      name: string;
      email: string;
      password: string;
      profile: string;
      creationDate: string;
      lastLogin: string;
    },
    creationDate: string;
  },
  idUsers: {
    id: number,
    name: string,
    email: string,
    password: string,
    profile: string,
    creationDate: string,
    lastLogin: string,
    deleted: boolean
  },
  descrition: string,
  startDate: string,
  endDate: string,
  registerDate: string
}
