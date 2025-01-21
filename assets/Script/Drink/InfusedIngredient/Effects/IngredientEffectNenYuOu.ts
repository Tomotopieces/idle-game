import { UniqueUtility } from "db://assets/Script/Equipment/UniqueUtility/UniqueUtility";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { PlayerDrinkEvent } from "db://assets/Script/Event/Events/PlayerDrinkEvent";
import { Buff, BuffType } from "db://assets/Script/Buff/Buff";
import { Unit } from "db://assets/Script/Event/Events/DealDamageEvent";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";

/**
 * 嫩玉藕
 *
 * 饮酒后一定时间内，少许增加防御（15s+5%防御）
 */
export class IngredientEffectNenYuOu extends UniqueUtility {
    static readonly NAME: string = `nen_yu_ou`;
    static readonly DESCRIPTION: string = `饮酒后一定时间内，少许增加防御`;

    constructor() {
        super(IngredientEffectNenYuOu.NAME, IngredientEffectNenYuOu.DESCRIPTION);
    }

    onActivate(): void {
        EventCenter.register(EventName.PLAYER_DRINK, IngredientEffectNenYuOu.NAME, (_event: PlayerDrinkEvent) => {
            const buff = new Buff(IngredientEffectNenYuOu.NAME, Unit.PLAYER, BuffType.BUFF, 15, null,
                () => PlayerController.PLAYER.attributes.defenseBoost += 0.05,
                null,
                () => PlayerController.PLAYER.attributes.defenseBoost -= 0.05
            );
            PlayerController.PLAYER.buffs.add(buff);
        });
    }

    onDeactivate(): void {
        EventCenter.unregister(EventName.PLAYER_DRINK, IngredientEffectNenYuOu.NAME);
    }

}