import { ItemSerial } from "db://assets/Script/Item/ItemSerial";
import { Liquor } from "db://assets/Script/Drink/Liquor/Liquor";
import { LiquorMeta } from "db://assets/Script/Drink/Liquor/LiquorMeta";

/**
 * 酒序列化
 */
export class LiquorSerial extends ItemSerial {
    static override deserialize(meta: LiquorMeta, serial: LiquorSerial): Liquor {
        return new Liquor(meta, serial.uuid);
    }
}