import { ProductMetaJson } from "db://assets/Script/Shop/ProductMetaJson";
import { Shop } from "db://assets/Script/Shop/Shop";

/**
 * 商店JSON
 */
export class ShopJson {
    /**
     * 所在场景名
     */
    readonly scene: string;

    /**
     * 商品元数据JSON列表
     */
    readonly products: ProductMetaJson[];

    /**
     * 转换为商店
     *
     * @param id       ID
     * @param shopJson 商店JSON
     */
    static toShop(id: number, shopJson: ShopJson): Shop {
        return new Shop(id, shopJson.scene, shopJson.products.map(metaJson => ProductMetaJson.toProductMeta(metaJson)));
    }
}