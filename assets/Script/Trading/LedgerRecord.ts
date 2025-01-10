/**
 * 账本记录
 */
export class LedgerRecord {
    /**
     * 商店场景
     */
    readonly shopScene: string;

    /**
     * 物品名称
     */
    readonly itemName: string;

    /**
     * 卖出数量
     */
    sellCount: number;

    constructor(shopScene: string, itemName: string, sellCount: number) {
        this.shopScene = shopScene;
        this.itemName = itemName;
        this.sellCount = sellCount;
    }
}