import { EventArgument } from "db://assets/Script/Event/EventArgument";
import { Equipment } from "db://assets/Script/Equipment/Equipment";

/**
 * 装备变更事件
 */
export class EquipEvent extends EventArgument {
    /**
     * 装备
     */
    equipment: Equipment;

    /**
     * 装备或卸下
     */
    equip: boolean;

    constructor(equipment: Equipment, equip: boolean) {
        super();
        this.equipment = equipment;
        this.equip = equip;
    }
}
