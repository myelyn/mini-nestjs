import { RequestMethod } from "./request-method.enum";

export interface MiddlewareConsumer {
  apply(...middleware: Function[] | any[]): this;
  forRoutes(
    ...routes: Array<string | { path: string; method: RequestMethod }>
  ): this;
}
