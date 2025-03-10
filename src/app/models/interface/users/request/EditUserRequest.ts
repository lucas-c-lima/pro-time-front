export interface EditUserRequest{
  id: number,
  name: string,
  email: string,
  password: string | null,
  profile: string,
  deleted: boolean
}
