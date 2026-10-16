export {};

declare global {
  interface Response {
    json<T = any>(): Promise<T>;
  }
}
