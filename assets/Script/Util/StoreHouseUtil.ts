import { ItemStack } from "db://assets/Script/Item/Item";

/**
 * 仓库类型
 */
export type StoreHouse = Map<number, ItemStack>;

/**
 * 仓库工具
 */
export class StoreHouseUtil {
    /**
     * 放入物品
     *
     * @param storeHouse 仓库
     * @param stackList 存放物品列表
     */
    static putIn(storeHouse: StoreHouse, stackList: Array<ItemStack>) {
        stackList.forEach(stack => {
            if (storeHouse.has(stack.itemId)) {
                const itemStack = storeHouse.get(stack.itemId);
                itemStack.count += stack.count;
            } else {
                storeHouse.set(stack.itemId, stack);
            }
        });
    }

    /**
     * 检查物品是否足够
     *
     * @param storeHouse 仓库
     * @param stackList 需求物品列表
     */
    static check(storeHouse: StoreHouse, stackList: Array<ItemStack>): boolean {
        return stackList.every(stack => {
            if (storeHouse.has(stack.itemId)) {
                const itemStack = storeHouse.get(stack.itemId);
                return itemStack.count >= stack.count;
            } else {
                return false;
            }
        });
    }

    /**
     * 取出物品
     *
     * @param storeHouse 仓库
     * @param stackList 需求物品列表
     */
    static tackOut(storeHouse: StoreHouse, stackList: Array<ItemStack>) {
        stackList.forEach(stack => {
            if (storeHouse.has(stack.itemId)) {
                const itemStack = storeHouse.get(stack.itemId);
                itemStack.count -= stack.count;
                if (itemStack.count <= 0) {
                    storeHouse.delete(stack.itemId);
                }
            }
        });
    }

    /**
     * 取出一件物品
     *
     * @param storeHouse 仓库
     * @param itemId 物品ID
     */
    static tackOutOne(storeHouse: StoreHouse, itemId: number) {
        if (storeHouse.has(itemId)) {
            const itemStack = storeHouse.get(itemId);
            itemStack.count -= 1;
            if (itemStack.count <= 0) {
                storeHouse.delete(itemId);
            }
        }
    }
}