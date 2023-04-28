

export interface UserData {
  save(): string | PromiseLike<string>
  img: string;
  role: string;
  facebook: boolean;
  google: boolean;
  createAt: Date;
  state: boolean;
  name?: string | undefined;
  email?: string | undefined;
  password?: string;
  securityToken?: string | undefined;
}