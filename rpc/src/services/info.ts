import { BadRequestDataError } from "../core/ApiError";
import {info} from "../../../src/monitor/src/lib/ava";

class Info {
  public static async getBlockchainID(alias: string): Promise<string> {
      const {data} = await info.getBlockchainID({ alias });
      if (!data?.blockchainID) throw new BadRequestDataError(data.error.message, data.error.data);
      return data.blockchainID;
  }
}

export default Info;
