import { UniqueUtility } from "db://assets/Script/Equipment/UniqueUtility/UniqueUtility";

/**
 * 椰子酒
 *
 * 每饮一口，恢复当前上限三成三分的生命
 */
export class LiquorEffectYeZiJiu extends UniqueUtility {
    static readonly NAME: string = `ye_zi_jiu`;
    static readonly DESCRIPTION: string = `每饮一口，恢复当前上限三成三分的生命`;

    constructor() {
        super(LiquorEffectYeZiJiu.NAME, LiquorEffectYeZiJiu.DESCRIPTION);
    }

    onActivate(): void {
        // 无特殊效果
    }

    onDeactivate(): void {
        // 无特殊效果
    }
 }