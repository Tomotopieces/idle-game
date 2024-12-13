import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { EquipmentType } from "db://assets/Script/Item/Equipment/Equipment";
import { Item, ItemType } from "db://assets/Script/Item/Item";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";
import { EventCenter } from "db://assets/Script/Event/EventCenter";

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
     * 装备栏
     */
    private static _equipmentSlot: Map<EquipmentType, ItemStack> = null;

    /**
     * 放入物品
     *
     * @param stackList          存放物品列表
     * @param checkEquipmentSlot 是否检查装备栏
     * @param showMessage        是否进行消息提示
     */
    static putIn(stackList: Array<ItemStack>, checkEquipmentSlot: boolean = true, showMessage: boolean = true) {
        const failedList = new Array<ItemStack>();
        stackList.forEach(stack => {
            if (StorehouseUtil.storehouse.has(stack.item.name) || (checkEquipmentSlot && this.inEquipmentSlot(stack.item))) {
                if (stack.item.unique) {
                    // 排除独特物品
                    failedList.push(stack);
                    return;
                }
                StorehouseUtil.storehouse.get(stack.item.name).count += stack.count;
            } else {
                StorehouseUtil.storehouse.set(stack.item.name, stack);
            }
        });

        // 保留不在 failedList 中的内容
        const updateList = stackList.filter(stack => failedList.findIndex(failed => failed.item.name === stack.item.name) === -1);
        if (updateList.length <= 0) {
            return;
        }

        if (showMessage) {
            updateList.forEach(stack =>
                EventCenter.emit(EventName.UI_POST_MESSAGE, `获得：${stack.item.displayName} * ${stack.count}`));
        }
        StorehouseUtil.emitUpdateEvent(updateList);
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
     * 检查物品是否存在
     *
     * @param itemName 物品名称
     */
    static checkOne(itemName: string): boolean {
        return StorehouseUtil.storehouse.has(itemName);
    }

    /**
     * 取出物品
     *
     * @param requireList 需求物品列表
     * @return 是否成功
     */
    static tackOut(requireList: Array<ItemStack>): boolean {
        for (const require of requireList) {
            if (StorehouseUtil.storehouse.has(require.item.name)) {
                const store = StorehouseUtil.storehouse.get(require.item.name);
                if (store.count < require.count) {
                    return false;
                }
                store.count -= require.count;
                if (store.count <= 0) {
                    StorehouseUtil.storehouse.delete(require.item.name);
                }
            } else {
                return false;
            }
        }

        StorehouseUtil.emitUpdateEvent(requireList);
        return true;
    }

    /**
     * 检查物品是否在装备栏内
     *
     * @param item 物品
     */
    private static inEquipmentSlot(item: Item): boolean {
        if (item.itemType !== ItemType.EQUIPMENT) {
            return false;
        }

        return Array.from(StorehouseUtil.equipmentMap.values()).some(stack => stack.item?.name === item.name)
    }

    /**
     * 取出一件物品
     *
     * @param itemName 物品名称
     * @return 是否成功
     */
    static tackOutOne(itemName: string): boolean {
        const itemStack = StorehouseUtil.storehouse.get(itemName);
        if (!itemStack) {
            return false;
        }
        itemStack.count -= 1;
        if (itemStack.count <= 0) {
            StorehouseUtil.storehouse.delete(itemName);
        }
        StorehouseUtil.emitUpdateEvent([{ item: itemStack.item, count: 1 }]);
        return true;
    }

    /**
     * 发送仓库更新事件
     *
     * @param stackList 更新物品列表
     */
    private static emitUpdateEvent(stackList: Array<ItemStack>) {
        /*
         * FIXME 只取stackList中的item数据，可能将参数类型改为Array<Item>更好？
         */

        // 发送被更新的物品的现有库存情况，避免修改stackList数据
        const updateArray = new Array<ItemStack>();
        stackList.forEach(stack => updateArray.push(new ItemStack(stack.item, StorehouseUtil.storehouse.get(stack.item.name)?.count ?? 0)));
        EventCenter.emit(EventName.UI_UPDATE_STOREHOUSE, updateArray);
    }

    private static get storehouse(): Storehouse {
        if (!StorehouseUtil._storehouse) {
            StorehouseUtil._storehouse = GlobalState.getState(GlobalStateName.STOREHOUSE);
        }
        return StorehouseUtil._storehouse;
    }

    private static get equipmentMap(): Map<EquipmentType, ItemStack> {
        if (!StorehouseUtil._equipmentSlot) {
            StorehouseUtil._equipmentSlot = (GlobalState.getState(GlobalStateName.PLAYER) as PlayerController).equipments.equipmentMap;
        }
        return StorehouseUtil._equipmentSlot;
    }
}
