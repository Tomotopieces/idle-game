import { ItemMeta } from "db://assets/Script/Item/ItemMeta";

/**
 * 商品元数据
 */
export class ProductMeta {
    /**
     * 物品
     */
    readonly itemMeta: ItemMeta;

    /**
     * 价格
     */
    readonly price: number;

    /**
     * 初始数量
     */
    readonly initial: number;

    constructor(itemMeta: ItemMeta, price: number, initial: number) {
        this.itemMeta = itemMeta;
        this.price = price;
        this.initial = initial;
    }
}