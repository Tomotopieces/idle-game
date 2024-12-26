import { DropItem } from "db://assets/Script/Item/DropItem";
import { ItemStack } from "db://assets/Script/Item/ItemStack";

/**
 * 物品掉落工厂
 */
export class DropItemFactory {
    /**
     * 根据掉落列表生成物品
     *
     * @param dropList 掉落列表
     */
    static produce(dropList: DropItem[]): ItemStack[] {
        const result: ItemStack[] = [];
        dropList.forEach(drop => {
            if (Math.random() < drop.dropRate || drop.once) {
                result.push(new ItemStack(drop.item, Math.floor(Math.random() * (drop.max - drop.min + 1) + drop.min)));
            }
        });
        return result;
    }
}