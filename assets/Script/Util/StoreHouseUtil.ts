import { EventTarget } from 'cc';
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";

/**
 * 仓库类型
 */
export type StoreHouse = Map<number, ItemStack>;

/**
 * 仓库工具
 */
export class StoreHouseUtil {
    /**
     * 仓库
     */
    private static _storeHouse: StoreHouse = null;

    /**
     * 自定义事件管理器
     */
    private static _eventTarget: EventTarget = null;

    /**
     * 放入物品
     *
     * @param stackList 存放物品列表
     */
    static putIn(stackList: Array<ItemStack>) {
        stackList.forEach(stack => {
            if (StoreHouseUtil.storeHouse.has(stack.itemId)) {
                const itemStack = StoreHouseUtil.storeHouse.get(stack.itemId);
                itemStack.count += stack.count;
            } else {
                StoreHouseUtil.storeHouse.set(stack.itemId, stack);
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
            if (StoreHouseUtil.storeHouse.has(stack.itemId)) {
                const itemStack = StoreHouseUtil.storeHouse.get(stack.itemId);
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
            if (StoreHouseUtil.storeHouse.has(stack.itemId)) {
                const itemStack = StoreHouseUtil.storeHouse.get(stack.itemId);
                itemStack.count -= stack.count;
                if (itemStack.count <= 0) {
                    StoreHouseUtil.storeHouse.delete(stack.itemId);
                }
            }
        });

        StoreHouseUtil.emitUpdateEvent(stackList);
    }

    /**
     * 取出一件物品
     *
     * @param itemId 物品ID
     */
    static tackOutOne(itemId: number) {
        if (StoreHouseUtil.storeHouse.has(itemId)) {
            const itemStack = StoreHouseUtil.storeHouse.get(itemId);
            itemStack.count -= 1;
            if (itemStack.count <= 0) {
                StoreHouseUtil.storeHouse.delete(itemId);
            }
        }

        StoreHouseUtil.emitUpdateEvent([{ itemId, count: 1 }]);
    }

    /**
     * 发送仓库更新事件
     *
     * @param stackList 更新物品列表
     */
    private static emitUpdateEvent(stackList: Array<ItemStack>) {
        stackList.forEach(stack => stack.count = StoreHouseUtil.storeHouse.get(stack.itemId)?.count ?? 0);
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