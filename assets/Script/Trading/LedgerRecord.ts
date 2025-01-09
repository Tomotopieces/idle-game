/**
 * 账本记录
 */
export class LedgerRecord {
    /**
     * 物品名称
     */
    readonly itemName: string;

    /**
     * 卖出数量
     */
    sellCount: number;

    constructor(itemName: string, sellCount: number) {
        this.itemName = itemName;
        this.sellCount = sellCount;
    }
}