import { PassiveEffect } from "db://assets/Script/PassiveEffect/PassiveEffect";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { PlayerDrinkEvent } from "db://assets/Script/Event/Events/PlayerDrinkEvent";
import { EventName } from "db://assets/Script/Event/EventName";
import { Buff, BuffType } from "db://assets/Script/Buff/Buff";
import { Unit } from "db://assets/Script/Event/Events/DealDamageEvent";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";

/**
 * 羔儿酿
 *
 * 每饮一口，立刻恢复当前上限两成的生命；其后片时内，持续缓慢恢复两成半的生命
 */
export class LiquorEffectGaoErNiang extends PassiveEffect {
    static readonly NAME: string = `gao_er_niang`;
    static readonly DESCRIPTION: string = `每饮一口，立刻恢复当前上限两成的生命；其后片时内，持续缓慢恢复两成半的生命`;

    constructor() {
        super(LiquorEffectGaoErNiang.NAME, LiquorEffectGaoErNiang.DESCRIPTION);
    }

    activate(): void {
        EventCenter.register(EventName.PLAYER_DRINK, LiquorEffectGaoErNiang.NAME, (_event: PlayerDrinkEvent) => {
            const buff = new Buff(LiquorEffectGaoErNiang.NAME, Unit.PLAYER, BuffType.BUFF, 5, 1,
                null,
                () => PlayerController.PLAYER.recover(0.05), // 恢复5次，每次恢复5%
                null);
            PlayerController.PLAYER.buffs.add(buff);
        });
    }

    deactivate(): void {
        EventCenter.unregister(EventName.PLAYER_DRINK, LiquorEffectGaoErNiang.NAME);
    }
}