import { BadRequestDataError } from "../core/ApiError";
import * as ava from "../../../src/monitor/src/lib/ava";

class Common {
  public static async executeMethod(category: string, method: string, args: any): Promise<any> {
      // @ts-ignore
      if (!ava?.[category]?.[method]) throw new BadRequestDataError("Invalid method!", null);

      // @ts-ignore
      const {data} = await ava[category][method](args);
      if (data?.error) throw new BadRequestDataError(data.error.message, data.error.data);

      return data;
  }
}

export default Common;
