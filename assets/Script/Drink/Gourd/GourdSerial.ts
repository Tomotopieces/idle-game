import { ItemSerial } from "db://assets/Script/Item/ItemSerial";
import { Gourd } from "db://assets/Script/Drink/Gourd/Gourd";
import { GourdMeta } from "db://assets/Script/Drink/Gourd/GourdMeta";

/**
 * 葫芦序列化
 */
export class GourdSerial extends ItemSerial {
    /**
     * 剩余酒量
     */
    remain: number;

    constructor(gourd: Gourd) {
        super(gourd);
        this.remain = gourd.remain;
    }

    /**
     * 反序列化
     *
     * @param meta   元数据
     * @param serial 序列化数据
     */
    static override deserialize(meta: GourdMeta, serial: GourdSerial): Gourd {
        return new Gourd(meta, serial.uuid, serial.remain);
    }
}