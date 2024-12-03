/**
 * 物品堆叠
 */
export class ItemStack {
    /**
     * 物品名称
     */
    itemName: string;

    /**
     * 数量
     */
    count: number;

    constructor(itemName: string, count: number) {
        this.itemName = itemName;
        this.count = count;
    }

    /**
     * 从Object重新创建
     *
     * @param obj Object
     * @return ItemStack
     */
    static fromObject(obj: any): ItemStack {
        return new ItemStack(obj.itemName, obj.count);
    }
}