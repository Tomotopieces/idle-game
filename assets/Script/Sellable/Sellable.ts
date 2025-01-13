import { Item } from "db://assets/Script/Item/Item";
import { SellableMeta } from "db://assets/Script/Sellable/SellableMeta";

/**
 * 玩家贩卖品
 */
export class Sellable extends Item {
    /**
     * 价格
     */
    readonly price: number;

    constructor(meta: SellableMeta) {
        super(meta);
        this.price = meta.price;
    }
}