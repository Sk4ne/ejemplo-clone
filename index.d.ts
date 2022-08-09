
export interface UserInfo {
  id:number;
  name:string;
  email:string;
  img:string;
  password:string;
  role:string;
  createAt:Date,
  state:boolean 
}

/** This lines are examples */
export interface imageUser {
  img:string; 
}

export interface UserData {
  name:string | undefined;
  role:string | undefined; 
}




