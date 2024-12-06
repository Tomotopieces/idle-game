import { EventTarget } from 'cc';
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";
import { ItemStack } from "db://assets/Script/Item/ItemStack";

/**
 * 仓库类型
 */
export type StoreHouse = Map<string, ItemStack>;

/**
 * 仓库工具
 */
export class StoreHouseUtil {
    /**
     * 仓库
     */
    private static _storeHouse: StoreHouse = null;

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
            if (StoreHouseUtil.storeHouse.has(stack.item.name)) {
                const itemStack = StoreHouseUtil.storeHouse.get(stack.item.name);
                itemStack.count += stack.count;
            } else {
                StoreHouseUtil.storeHouse.set(stack.item.name, stack);
            }
        });

        StoreHouseUtil.emitUpdateEvent(stackList);
    }

    /**
     * 检查物品是否足够
     *
     * @param stackList 需求物品列表
     */
    static check(stackList: Array<ItemStack>): boolean {
        return stackList.every(stack => {
            if (StoreHouseUtil.storeHouse.has(stack.item.name)) {
                const itemStack = StoreHouseUtil.storeHouse.get(stack.item.name);
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
            if (StoreHouseUtil.storeHouse.has(stack.item.name)) {
                const itemStack = StoreHouseUtil.storeHouse.get(stack.item.name);
                itemStack.count -= stack.count;
                if (itemStack.count <= 0) {
                    StoreHouseUtil.storeHouse.delete(stack.item.name);
                }
            }
        });

        StoreHouseUtil.emitUpdateEvent(stackList);
    }

    /**
     * 取出一件物品
     *
     * @param itemName 物品名称
     */
    static tackOutOne(itemName: string) {
        if (StoreHouseUtil.storeHouse.has(itemName)) {
            const itemStack = StoreHouseUtil.storeHouse.get(itemName);
            itemStack.count -= 1;
            if (itemStack.count <= 0) {
                StoreHouseUtil.storeHouse.delete(itemName);
            }
            StoreHouseUtil.emitUpdateEvent([{ item: itemStack.item, count: null }]);
        }
    }

    /**
     * 发送仓库更新事件
     *
     * @param stackList 更新物品列表
     */
    private static emitUpdateEvent(stackList: Array<ItemStack>) {
        stackList.forEach(stack => stack.count = StoreHouseUtil.storeHouse.get(stack.item.name)?.count ?? 0);
        StoreHouseUtil.eventTarget.emit(EventName.UPDATE_STORE_HOUSE, stackList);
    }

    private static get storeHouse(): StoreHouse {
        if (!StoreHouseUtil._storeHouse) {
            StoreHouseUtil._storeHouse = GlobalState.getState(GlobalStateName.STORE_HOUSE);
        }
        return StoreHouseUtil._storeHouse;
    }

    private static get eventTarget(): EventTarget {
        if (!StoreHouseUtil._eventTarget) {
            StoreHouseUtil._eventTarget = GlobalState.getState(GlobalStateName.EVENT_TARGET);
        }
        return StoreHouseUtil._eventTarget;
    }
}