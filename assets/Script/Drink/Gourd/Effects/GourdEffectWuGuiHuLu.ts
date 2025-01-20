import { UniqueUtility } from "db://assets/Script/Equipment/UniqueUtility/UniqueUtility";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { PlayerDrinkEvent } from "db://assets/Script/Event/Events/PlayerDrinkEvent";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";
import { Buff, BuffType } from "db://assets/Script/Buff/Buff";
import { Unit } from "db://assets/Script/Event/Events/DealDamageEvent";

/**
 * 五鬼葫芦
 *
 * 恢复效果减半，但饮酒后20秒内，增加15攻击
 */
export class GourdEffectWuGuiHuLu extends UniqueUtility {
    static readonly NAME: string = `wu_gui_hu_lu`;
    static readonly DESCRIPTION: string = `恢复效果减半，但饮酒后一定时间内，增加攻击造成的伤害`;

    constructor() {
        super(GourdEffectWuGuiHuLu.NAME, GourdEffectWuGuiHuLu.DESCRIPTION);
    }

    onActivate(): void {
        EventCenter.register(EventName.PLAYER_DRINK, GourdEffectWuGuiHuLu.NAME, (event: PlayerDrinkEvent) => {
            event.healthRecoverRatio *= 0.5;
            const buff = new Buff(GourdEffectWuGuiHuLu.NAME, Unit.PLAYER, BuffType.BUFF, 20, null,
                () => PlayerController.PLAYER.attributes.additionalDamage += 15, // 开始时增加15攻击力
                null,
                () => PlayerController.PLAYER.attributes.additionalDamage -= 15 // 结束时恢复
            );
            PlayerController.PLAYER.buffs.add(buff);
        });
    }

    onDeactivate(): void {
        EventCenter.unregister(EventName.PLAYER_DRINK, GourdEffectWuGuiHuLu.NAME);
    }

}