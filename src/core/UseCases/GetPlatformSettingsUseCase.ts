import { IPlatformSettingRepository } from "../Repositories/IPlatformSettingRepository";
import { PlatformSetting } from "../Entities/PlatformSetting";

export class GetPlatformSettingsUseCase {
  constructor(private repository: IPlatformSettingRepository) {}

  async execute(): Promise<PlatformSetting> {
    return this.repository.getSettings();
  }
}
