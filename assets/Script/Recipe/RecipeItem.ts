import { Item } from "db://assets/Script/Item/Item";

/**
 * 配方材料
 */
export class RecipeItem {
    /**
     * 物品名称
     */
    readonly item: Item;

    /**
     * 物品数量
     */
    readonly count: number;

    /**
     * 是否消耗
     */
    readonly consume: boolean;

    constructor(item: Item, itemCount: number, consume: boolean) {
        this.item = item;
        this.count = itemCount ?? 1;
        this.consume = consume ?? true;
    }
}