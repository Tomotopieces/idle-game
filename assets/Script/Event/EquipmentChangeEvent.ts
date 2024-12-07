import { Equipment } from "db://assets/Script/Item/Equipment/Equipment";

/**
 * 装备变更事件
 */
export class EquipmentChangeEvent {
    /**
     * 装备
     */
    readonly equipment: Equipment;

    /**
     * 装备或卸下
     */
    readonly equip: boolean;

    constructor(equipment: Equipment, equip: boolean) {
        this.equipment = equipment;
        this.equip = equip;
    }
}
