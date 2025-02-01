import { ItemSerial } from "db://assets/Script/Item/ItemSerial";
import { Sellable } from "db://assets/Script/Sellable/Sellable";
import { SellableMeta } from "db://assets/Script/Sellable/SellableMeta";

/**
 * 贩卖品序列化
 */
export class SellableSerial extends ItemSerial {
    static override deserialize(meta: SellableMeta, serial: SellableSerial): Sellable {
        return new Sellable(meta, serial.uuid);
    }
}