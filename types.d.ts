/* AQUI DEFINO TODOS LOS TIPOS DE ESTE PAQUETE */

// export type Weather = 'sunny' | 'rainy' | 'windy' |'storay'
// export type Visibility = 'great' | 'good' | 'ok' |'poor'

// export interface DiaryEntry {
//   id:number
//   date:string,
//   weather:Weather
//   visibility: Visibility
//   comment: string
// }

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

export interface imageUser {
  img:string; 
}