import { PlatformSetting } from "../Entities/PlatformSetting";

export interface IPlatformSettingRepository {
  getSettings(): Promise<PlatformSetting>;
}
