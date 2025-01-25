import { DropItem } from "db://assets/Script/Drop/DropItem";
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
    static drop(dropList: DropItem[]): ItemStack[] {
        const result: ItemStack[] = [];
        dropList.forEach(drop => {
            if (Math.random() < drop.dropRate || drop.once) {
                result.push(ItemStack.of(drop.itemMeta, Math.floor(Math.random() * (drop.max - drop.min + 1) + drop.min)));
            }
        });
        return result;
    }
}