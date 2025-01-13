import { EventArgument } from "db://assets/Script/Event/EventArgument";
import { ItemStack } from "db://assets/Script/Item/ItemStack";

/**
 * 装备变更事件
 */
export class EquipEvent extends EventArgument {
    /**
     * 装备
     */
    equipmentStack: ItemStack;

    /**
     * 装备或卸下
     */
    equip: boolean;

    constructor(equipmentStack: ItemStack, equip: boolean) {
        super();
        this.equipmentStack = equipmentStack;
        this.equip = equip;
    }
}
