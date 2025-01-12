import { ProductJson } from "db://assets/Script/Trading/ProductJson";
import { Shop } from "db://assets/Script/Trading/Shop";

/**
 * 商店JSON
 */
export class ShopJson {
    /**
     * 所在场景名
     */
    readonly scene: string;

    /**
     * 商品JSON列表
     */
    readonly products: ProductJson[];

    /**
     * 转换为商店
     *
     * @param id       ID
     * @param shopJson 商店JSON
     */
    static toShop(id: number, shopJson: ShopJson): Shop {
        return new Shop(id, shopJson.scene, shopJson.products.map(productJson => ProductJson.toItemStack(productJson)));
    }
}