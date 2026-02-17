export interface IUserState {
  token?: string;
  iUserId?: number;
  vEmail?: string;
  vPassword?: string;
  vFullName?: string;
}

export interface ILoginResponseState {
  status?: string;
  code?: string;
  message?: string;
  data?: {
    accessToken: string;
    user: IUserState;
  };
}

export interface IUserResponseState {
  status?: string;
  code?: string;
  message?: string;
  data?: IUserState;
}
