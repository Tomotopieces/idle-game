import { SetEffect } from "db://assets/Script/Item/Equipment/SetEffect/SetEffect";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName, LING_YUN_NAME } from "db://assets/Script/Util/Constant";
import { ItemStack } from "db://assets/Script/Item/ItemStack";

/**
 * 套装效果 锱铢必较
 *
 * 打杀对手后少许增加获得的灵蕴(+10%)
 */
export class SetEffectZiZhuBiJiao extends SetEffect {
    static NAME: string = 'zi_zhu_bi_jiao';
    static REQUIRE: number = 4;

    constructor() {
        super(SetEffectZiZhuBiJiao.NAME, SetEffectZiZhuBiJiao.REQUIRE);
    }

    onActivate(): void {
        EventCenter.register(EventName.GET_DROPS, this.name, (dropStackList: Array<ItemStack>) => {
            const index = dropStackList.findIndex(stack => stack.item.name === LING_YUN_NAME);
            if (index !== -1) {
                dropStackList[index].count = Math.round(dropStackList[index].count * 1.1);
            }
        });
    }

    onDeactivate(): void {
        EventCenter.unregister(EventName.GET_DROPS, this.name);
    }
}

