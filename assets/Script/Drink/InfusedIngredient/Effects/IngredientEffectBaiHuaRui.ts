import { PassiveEffect } from "db://assets/Script/PassiveEffect/PassiveEffect";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { PlayerDrinkEvent } from "db://assets/Script/Event/Events/PlayerDrinkEvent";
import { EventName } from "db://assets/Script/Event/EventName";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";
import { BuffType } from "db://assets/Script/Buff/Buff";

/**
 * 百花蕤
 *
 * 饮酒后，消除身处的所有异常状态
 */
export class IngredientEffectBaiHuaRui extends PassiveEffect {
    static readonly NAME: string = `bai_hua_rui`;
    static readonly DESCRIPTION: string = `饮酒后，消除身处的所有异常状态`;

    constructor() {
        super(IngredientEffectBaiHuaRui.NAME, IngredientEffectBaiHuaRui.DESCRIPTION);
    }

    activate(): void {
        EventCenter.register(EventName.PLAYER_DRINK, IngredientEffectBaiHuaRui.NAME, (_event: PlayerDrinkEvent) =>
            PlayerController.PLAYER.buffs.remove(buff => buff.type === BuffType.DEBUFF));
    }

    deactivate(): void {
        EventCenter.unregister(EventName.PLAYER_DRINK, IngredientEffectBaiHuaRui.NAME);
    }
}