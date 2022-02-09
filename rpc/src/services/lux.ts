import { BadRequestDataError } from "../core/ApiError";

class Lux {
  public static async helloWorld(): Promise<any> {
    try {
      return "Hello World!";
    } catch (error) {
      console.log(error);
      throw new BadRequestDataError(`Internal server error: `, error);
    }
  }
}

export default Lux;
