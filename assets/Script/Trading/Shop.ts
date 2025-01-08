import { ItemStack } from "db://assets/Script/Item/ItemStack";

/**
 * 商店
 */
export class Shop {
    /**
     * ID
     */
    readonly id: number;

    /**
     * 所在场景名(Chapter | Area | Stage)
     */
    readonly scene: string;

    /**
     * 商品列表
     *
     * 数组元素为TradingItem
     */
    readonly products: ItemStack[];

    constructor(id: number, scene: string, products: ItemStack[]) {
        this.id = id;
        this.scene = scene;
        this.products = products;
    }
}