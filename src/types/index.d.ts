export {};

declare global {
  namespace Express {
    interface Request {
      // user: any;
      user: {name:string,role:string};
    }
  }
}
type CookieSession = CookieSessionObject | null | undefined;  
export { CookieSession }