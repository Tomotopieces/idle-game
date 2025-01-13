import { ProductMeta } from "db://assets/Script/Shop/ProductMeta";
import { ITEM_META_TABLE } from "db://assets/Script/DataTable";

/**
 * 商品元数据Json
 */
export class ProductMetaJson {
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
    readonly initial: number;

    /**
     * 转换为ProductMeta
     *
     * @param productJson ProductJson
     * @return {ProductMeta} ProductMeta
     */
    static toProductMeta(productJson: ProductMetaJson): ProductMeta {
        return new ProductMeta(ITEM_META_TABLE.get(productJson.itemName), productJson.price, productJson.initial);
    }
}