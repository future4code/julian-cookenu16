import { CustomError } from "../CustomError";

export class ForbidenError extends CustomError {
  constructor (message:string) {
    super(message, 403);
  }
}