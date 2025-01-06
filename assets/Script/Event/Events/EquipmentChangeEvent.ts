import { Equipment } from "db://assets/Script/Item/Equipment/Equipment";
import { EventArgument } from "db://assets/Script/Event/EventArgument";

/**
 * 装备变更事件
 */
export class EquipmentChangeEvent extends EventArgument {
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
