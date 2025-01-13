import { ProductMeta } from "db://assets/Script/Shop/ProductMeta";
import { ItemMeta } from "db://assets/Script/Item/ItemMeta";

/**
 * 商品
 */
export class Product {
    /**
     * 元数据
     */
    readonly meta: ProductMeta;

    /**
     * 数量
     */
    count: number;

    constructor(meta: ProductMeta) {
        this.meta = meta;
        this.count = meta.initial;
    }

    get itemMeta(): ItemMeta {
        return this.meta.itemMeta;
    }

    get price(): number {
        return this.meta.price;
    }

    get initial(): number {
        return this.meta.initial;
    }
}