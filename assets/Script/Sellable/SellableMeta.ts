import { ItemMeta } from "db://assets/Script/Item/ItemMeta";

/**
 * 玩家贩卖品元数据
 */
export class SellableMeta extends ItemMeta {
    /**
     * 价格
     */
    readonly price: number;

    constructor(meta: ItemMeta, price: number) {
        super(meta.id, meta.name, meta.displayName, meta.itemType, meta.description, meta.icon, meta.unique, meta.rarity);
        this.price = price;
    }
}