import { EventTarget } from 'cc';
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";
import { ItemStack } from "db://assets/Script/Item/ItemStack";

/**
 * 仓库类型
 */
export type Storehouse = Map<string, ItemStack>;

/**
 * 仓库工具
 */
export class StorehouseUtil {
    /**
     * 仓库
     */
    private static _storehouse: Storehouse = null;

    /**
     * 事件中心
     */
    private static _eventTarget: EventTarget = null;

    /**
     * 放入物品
     *
     * @param stackList 存放物品列表
     */
    static putIn(stackList: Array<ItemStack>) {
        stackList.forEach(stack => {
            if (StorehouseUtil.storehouse.has(stack.item.name)) {
                if (stack.item.unique) {
                    // 排除独特物品
                    return;
                }
                const itemStack = StorehouseUtil.storehouse.get(stack.item.name);
                itemStack.count += stack.count;
            } else {
                StorehouseUtil.storehouse.set(stack.item.name, stack);
            }
        });

        StorehouseUtil.emitUpdateEvent(stackList);
    }

    /**
     * 检查物品是否足够
     *
     * @param stackList 需求物品列表
     */
    static check(stackList: Array<ItemStack>): boolean {
        return stackList.every(stack => {
            if (StorehouseUtil.storehouse.has(stack.item.name)) {
                const itemStack = StorehouseUtil.storehouse.get(stack.item.name);
                return itemStack.count >= stack.count;
            } else {
                return false;
            }
        });
    }

    /**
     * 取出物品
     *
     * @param stackList 需求物品列表
     */
    static tackOut(stackList: Array<ItemStack>) {
        stackList.forEach(stack => {
            if (StorehouseUtil.storehouse.has(stack.item.name)) {
                const itemStack = StorehouseUtil.storehouse.get(stack.item.name);
                itemStack.count -= stack.count;
                if (itemStack.count <= 0) {
                    StorehouseUtil.storehouse.delete(stack.item.name);
                }
            }
        });

        StorehouseUtil.emitUpdateEvent(stackList);
    }

    /**
     * 取出一件物品
     *
     * @param itemName 物品名称
     */
    static tackOutOne(itemName: string) {
        if (StorehouseUtil.storehouse.has(itemName)) {
            const itemStack = StorehouseUtil.storehouse.get(itemName);
            itemStack.count -= 1;
            if (itemStack.count <= 0) {
                StorehouseUtil.storehouse.delete(itemName);
            }
            StorehouseUtil.emitUpdateEvent([{ item: itemStack.item, count: null }]);
        }
    }

    /**
     * 发送仓库更新事件
     *
     * @param stackList 更新物品列表
     */
    private static emitUpdateEvent(stackList: Array<ItemStack>) {
        stackList.forEach(stack => stack.count = StorehouseUtil.storehouse.get(stack.item.name)?.count ?? 0);
        StorehouseUtil.eventTarget.emit(EventName.UPDATE_STOREHOUSE, stackList);
    }

    private static get storehouse(): Storehouse {
        if (!StorehouseUtil._storehouse) {
            StorehouseUtil._storehouse = GlobalState.getState(GlobalStateName.STOREHOUSE);
        }
        return StorehouseUtil._storehouse;
    }

    private static get eventTarget(): EventTarget {
        if (!StorehouseUtil._eventTarget) {
            StorehouseUtil._eventTarget = GlobalState.getState(GlobalStateName.EVENT_TARGET);
        }
        return StorehouseUtil._eventTarget;
    }
}
