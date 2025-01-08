import { TradingItem } from "db://assets/Script/Trading/TradingItem";
import { ITEM_TABLE } from "db://assets/Script/DataTable";
import { ItemStack } from "db://assets/Script/Item/ItemStack";

/**
 * 商品Json
 */
export class ProductJson {
    /**
     * 物品名称
     */
    readonly itemName: string;

    /**
     * 单价
     */
    readonly price: number;

    /**
     * 数量
     */
    readonly count: number;

    constructor(itemName: string, price: number, count: number) {
        this.itemName = itemName;
        this.price = price;
        this.count = count;
    }

    /**
     * 转换为ItemStack
     *
     * @param productJson ProductJson
     */
    toItemStack(productJson: ProductJson): ItemStack {
        return new ItemStack(TradingItem.fromItem(ITEM_TABLE.get(productJson.itemName), productJson.price), productJson.count);
    }
}