import { Item } from "db://assets/Script/Item/Item";
import { SellableMeta } from "db://assets/Script/Sellable/SellableMeta";

/**
 * 玩家贩卖品
 */
export class Sellable extends Item {
    readonly meta: SellableMeta;

    constructor(meta: SellableMeta) {
        super(meta);
        this.meta = meta;
    }

    get price(): number {
        return this.meta.price;
    }
}