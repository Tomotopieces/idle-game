import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { LING_YUN_NAME } from "db://assets/Script/Util/Constant";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { EventName } from "db://assets/Script/Event/EventName";
import { PassiveEffect } from "db://assets/Script/PassiveEffect/PassiveEffect";

/**
 * 套装效果 锱铢必较
 *
 * 打杀对手后少许增加获得的灵蕴(+10%)
 */
export class SetBonusEffectZiZhuBiJiao extends PassiveEffect {
    static NAME: string = 'zi_zhu_bi_jiao';
    static DESCRIPTION: string = '打杀对手后少许增加获得的灵蕴(+10%)。';
    static REQUIREMENT: number = 4;

    constructor() {
        super(SetBonusEffectZiZhuBiJiao.NAME, SetBonusEffectZiZhuBiJiao.DESCRIPTION);
    }

    activate(): void {
        EventCenter.register(EventName.GET_DROPS, SetBonusEffectZiZhuBiJiao.NAME, (dropStackList: ItemStack[]) => {
            const index = dropStackList.findIndex(stack => stack.item.name === LING_YUN_NAME);
            if (index !== -1) {
                dropStackList[index].count = Math.round(dropStackList[index].count * 1.1);
            }
        });
    }
    deactivate(): void {
        EventCenter.unregister(EventName.GET_DROPS, SetBonusEffectZiZhuBiJiao.NAME);
    }
}
