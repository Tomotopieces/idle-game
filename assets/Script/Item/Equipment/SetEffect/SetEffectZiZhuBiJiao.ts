import { SetEffect, SetLevelEffect } from "db://assets/Script/Item/Equipment/SetEffect/SetEffect";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { LING_YUN_NAME } from "db://assets/Script/Util/Constant";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { EventName } from "db://assets/Script/Event/EventName";

/**
 * 套装效果 锱铢必较
 *
 * 打杀对手后少许增加获得的灵蕴(+10%)
 */
export class SetEffectZiZhuBiJiao extends SetEffect {
    static NAME: string = 'zi_zhu_bi_jiao';
    static DESCRIPTION: string = '打杀对手后少许增加获得的灵蕴(+10%)。';
    static REQUIRE: number = 4;

    constructor() {
        super(SetEffectZiZhuBiJiao.NAME);

        // 添加等级效果
        this.levelEffectMap.set(SetEffectZiZhuBiJiao.REQUIRE, new class extends SetLevelEffect {
            constructor() {
                super(SetEffectZiZhuBiJiao.DESCRIPTION, SetEffectZiZhuBiJiao.REQUIRE);
            }

            override onActivate(): void {
                super.onActivate();
                EventCenter.register(EventName.GET_DROPS, SetEffectZiZhuBiJiao.NAME, (dropStackList: ItemStack[]) => {
                    const index = dropStackList.findIndex(stack => stack.item.name === LING_YUN_NAME);
                    if (index !== -1) {
                        dropStackList[index].count = Math.round(dropStackList[index].count * 1.1);
                    }
                });
            }

            override onDeactivate(): void {
                super.onDeactivate();
                EventCenter.unregister(EventName.GET_DROPS, SetEffectZiZhuBiJiao.NAME);
            }
        })
    }
}

