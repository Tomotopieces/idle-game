import { ItemSerial } from "db://assets/Script/Item/ItemSerial";
import { Equipment } from "db://assets/Script/Equipment/Equipment";
import { EquipmentMeta } from "db://assets/Script/Equipment/EquipmentMeta";

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
     *
     * @param meta   元数据
     * @param serial 序列化数据
     */
    static override deserialize(meta: EquipmentMeta, serial: EquipmentSerial): Equipment {
        return new Equipment(meta, serial.uuid, serial.rank);
    }
}