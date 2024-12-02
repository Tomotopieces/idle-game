/**
 * 物品堆叠
 */
export class ItemStack {
    /**
     * 物品ID
     */
    itemId: number;

    /**
     * 数量
     */
    count: number;

    constructor(itemId: number, count: number) {
        this.itemId = itemId;
        this.count = count;
    }

    /**
     * 从Object重新创建
     *
     * @param obj Object
     */
    static fromObject(obj: any): ItemStack {
        return new ItemStack(obj.itemId, obj.count);
    }
}