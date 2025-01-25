import { PassiveEffect } from "db://assets/Script/PassiveEffect/PassiveEffect";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { PlayerDrinkEvent } from "db://assets/Script/Event/Events/PlayerDrinkEvent";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";
import { Buff, BuffType } from "db://assets/Script/Buff/Buff";
import { Unit } from "db://assets/Script/Event/Events/DealDamageEvent";

/**
 * 乾坤彩葫芦
 *
 * 饮尽葫芦中最后一口酒，30秒内，获得30%伤害加成
 */
export class GourdEffectQianKunCaiHuLu extends PassiveEffect {
    static readonly NAME: string = `qian_kun_cai_hu_lu`;
    static readonly DESCRIPTION: string = `饮尽葫芦中最后一口酒，一定时间内，较大增加造成的伤害。`;

    constructor() {
        super(GourdEffectQianKunCaiHuLu.NAME, GourdEffectQianKunCaiHuLu.DESCRIPTION);
    }

    activate(): void {
        EventCenter.register(EventName.PLAYER_DRINK, GourdEffectQianKunCaiHuLu.NAME, (_event: PlayerDrinkEvent) => {
            if (PlayerController.PLAYER.drink.gourd.remain !== 1) {
                return;
            }
            const buff = new Buff(GourdEffectQianKunCaiHuLu.NAME, Unit.PLAYER, BuffType.BUFF, 30, null,
                () => PlayerController.PLAYER.attributes.damageBoost += 0.3, // 开始时增加30%伤害
                null,
                () => PlayerController.PLAYER.attributes.damageBoost -= 0.3 // 结束时恢复
            );
            PlayerController.PLAYER.buffs.add(buff);
        })
    }

    deactivate(): void {
        EventCenter.unregister(EventName.PLAYER_DRINK, GourdEffectQianKunCaiHuLu.NAME);
    }
}