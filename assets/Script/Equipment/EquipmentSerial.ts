import { ItemSerial } from "db://assets/Script/Item/ItemSerial";
import { Equipment } from "db://assets/Script/Equipment/Equipment";

/**
 * 装备序列化
 */
export class EquipmentSerial extends ItemSerial {
    /**
     * 阶级
     */
    rank: number;

    constructor(equipment: Equipment) {
        super(equipment);
        this.rank = equipment.rank;
    }

    /**
     * 反序列化
     */
    deserialize(): Equipment {
        const equipment = super.deserialize() as Equipment;
        equipment.rank = this.rank;
        return equipment;
    }
}