import { EventArgument } from "db://assets/Script/Event/EventArgument";

/**
 * 商品购买（后）事件
 */
export class ProductPurchasedEvent extends EventArgument {
    /**
     * 商品名称
     */
    productName: string;

    constructor(productName: string) {
        super();
        this.productName = productName;
    }
}