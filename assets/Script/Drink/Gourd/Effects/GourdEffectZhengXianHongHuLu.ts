import { UniqueUtility } from "db://assets/Script/Equipment/UniqueUtility/UniqueUtility";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { PlayerDrinkEvent } from "db://assets/Script/Event/Events/PlayerDrinkEvent";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";
import { GourdState } from "db://assets/Script/Drink/Gourd/GourdState";

/**
 * 争先红葫芦
 *
 * 盛满酒时，饮下第一口酒，可恢复全部生命
 */
export class GourdEffectZhengXianHongHuLu extends UniqueUtility {
    static readonly NAME: string = `zheng_xian_hong_hu_lu`;
    static readonly DESCRIPTION: string = `盛满酒时，饮下第一口酒，可恢复全部生命`;

    constructor() {
        super(GourdEffectZhengXianHongHuLu.NAME, GourdEffectZhengXianHongHuLu.DESCRIPTION);
    }

    onActivate(): void {
        EventCenter.register(EventName.PLAYER_DRINK, GourdEffectZhengXianHongHuLu.NAME, (event: PlayerDrinkEvent) => {
            if (PlayerController.PLAYER.drink.gourd.state === GourdState.FULL) {
                event.healthRecoverRatio = 1;
            }
        });
    }

    onDeactivate(): void {
        EventCenter.unregister(EventName.PLAYER_DRINK, GourdEffectZhengXianHongHuLu.NAME);
    }

}