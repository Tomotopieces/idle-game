import { PassiveEffect } from "db://assets/Script/PassiveEffect/PassiveEffect";

/**
 * 椰子酒
 *
 * 每饮一口，恢复当前上限三成三分的生命
 */
export class LiquorEffectYeZiJiu extends PassiveEffect {
    static readonly NAME: string = `ye_zi_jiu`;
    static readonly DESCRIPTION: string = `每饮一口，恢复当前上限三成三分的生命`;

    constructor() {
        super(LiquorEffectYeZiJiu.NAME, LiquorEffectYeZiJiu.DESCRIPTION);
    }

    activate(): void {
        // 无特殊效果
    }

    deactivate(): void {
        // 无特殊效果
    }
 }