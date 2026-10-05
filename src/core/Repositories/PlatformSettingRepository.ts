import { IPlatformSettingRepository } from "./IPlatformSettingRepository";
import { PlatformSetting } from "../Entities/PlatformSetting";

export class PlatformSettingRepository implements IPlatformSettingRepository {
  async getSettings(): Promise<PlatformSetting> {
    const baseUrl = process.env.API_GATEWAY_URL || "http://e-learning-docker-api-1";
    const res = await fetch(`${baseUrl}/api/v1/platform-settings`, {
      next: { revalidate: 60, tags: ["platform-settings"] }
    });
    
    if (!res.ok) {
      return { service_fee: 0 };
    }
    
    const json = await res.json();
    return {
      service_fee: parseFloat(json.data?.service_fee) || 0
    };
  }
}
