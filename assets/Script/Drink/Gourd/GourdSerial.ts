import { ItemSerial } from "db://assets/Script/Item/ItemSerial";
import { Gourd } from "db://assets/Script/Drink/Gourd/Gourd";

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
}