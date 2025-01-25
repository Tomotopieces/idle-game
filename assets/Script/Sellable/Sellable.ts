import { Item } from "db://assets/Script/Item/Item";
import { SellableMeta } from "db://assets/Script/Sellable/SellableMeta";

/**
 * 玩家贩卖品
 */
export class Sellable extends Item {
    declare meta: SellableMeta;

    constructor(meta: SellableMeta, uuid?: string) {
        super(meta, uuid);
    }

    get price(): number {
        return this.meta.price;
    }
}