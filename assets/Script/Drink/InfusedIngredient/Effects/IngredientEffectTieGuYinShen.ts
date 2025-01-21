import { UniqueUtility } from "db://assets/Script/Equipment/UniqueUtility/UniqueUtility";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { PlayerDrinkEvent } from "db://assets/Script/Event/Events/PlayerDrinkEvent";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";

/**
 * 铁骨银参
 *
 * 饮酒时，立刻获得30棍势
 */
export class IngredientEffectTieGuYinShen extends UniqueUtility {
    static readonly NAME: string = `tie_gu_yin_shen`;
    static readonly DESCRIPTION: string = `饮酒时，立刻获得30棍势`;

    constructor() {
        super(IngredientEffectTieGuYinShen.NAME, IngredientEffectTieGuYinShen.DESCRIPTION);
    }

    onActivate(): void {
        EventCenter.register(EventName.PLAYER_DRINK, IngredientEffectTieGuYinShen.NAME, (_event: PlayerDrinkEvent) =>
            PlayerController.PLAYER.skills.resources.stance += 30);
    }

    onDeactivate(): void {
        EventCenter.unregister(EventName.PLAYER_DRINK, IngredientEffectTieGuYinShen.NAME);
    }
}