import { ProductMeta } from "db://assets/Script/Shop/ProductMeta";

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
     * 商品元数据列表
     */
    readonly productMetas: ProductMeta[];

    constructor(id: number, scene: string, productMetas: ProductMeta[]) {
        this.id = id;
        this.scene = scene;
        this.productMetas = productMetas;
    }
}