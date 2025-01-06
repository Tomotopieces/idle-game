import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { Equipment, EquipmentType } from "db://assets/Script/Item/Equipment/Equipment";
import { Item, ItemType } from "db://assets/Script/Item/Item";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { UIPostMessageEvent } from "db://assets/Script/Event/Events/UIPostMessageEvent";
import { MessageType } from "db://assets/Script/UI/Message/MessageFactory";

/**
 * 仓库类型
 */
export type StorehouseType = Map<string, ItemStack>;

/**
 * 仓库
 */
export class Storehouse {
    static STOREHOUSE: StorehouseType = new Map<string, ItemStack>();

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
    static putIn(stackList: ItemStack[], checkEquipmentSlot: boolean = true, showMessage: boolean = true) {
        const failedList: ItemStack[] = [];
        stackList.forEach(stack => {
            if (this.STOREHOUSE.has(stack.item.name) || (checkEquipmentSlot && this.inEquipmentSlot(stack.item))) {
                // 仓库内已有
                if (stack.item.unique) {
                    // 排除独特物品
                    failedList.push(stack);
                    return;
                }
                this.STOREHOUSE.get(stack.item.name).count += stack.count;
            } else {
                this.STOREHOUSE.set(stack.item.name, stack);
            }
        });

        // 保留不在 failedList 中的内容
        const updateList = stackList.filter(stack => failedList.findIndex(failed => failed.item.name === stack.item.name) === -1);
        if (updateList.length <= 0) {
            return;
        }

        if (showMessage) {
            updateList.forEach(stack =>
                EventCenter.emit(EventName.UI_POST_MESSAGE, new UIPostMessageEvent(MessageType.GAIN_ITEM, stack)));
        }
        Storehouse.emitUpdateEvent(updateList);
    }

    /**
     * 检查物品是否足够
     *
     * @param stackList          需求物品列表
     * @param checkEquipmentSlot 是否检查装备栏
     */
    static satisfy(stackList: ItemStack[], checkEquipmentSlot: boolean = true): boolean {
        return stackList.every(stack => {
            let count = this.STOREHOUSE.get(stack.item.name)?.count ?? 0;
            if (checkEquipmentSlot && this.inEquipmentSlot(stack.item)) {
                count += 1;
            }
            return count >= stack.count;
        });
    }

    /**
     * 统计物品数量
     *
     * @param targets            目标物品列表
     * @param checkEquipmentSlot 是否检查装备栏
     */
    static count(targets: Item[], checkEquipmentSlot: boolean = true): ItemStack[] {
        const itemStacks = Array.from(this.STOREHOUSE.values()).filter(stack => targets.some(target => target.name === stack.item.name));
        if (checkEquipmentSlot) {
            targets.forEach(target => {
                const stack = this.equipmentMap.get((target as Equipment).equipmentType);
                if (stack) {
                    const index = itemStacks.findIndex(stack => stack.item.name === target.name);
                    if (index !== -1) {
                        itemStacks[index].count += stack.count;
                    } else {
                        itemStacks.push(stack);
                    }
                }
            });
        }
        return itemStacks;
    }

    /**
     * 统计物品数量
     *
     * @param target             目标物品 | 名称
     * @param checkEquipmentSlot 是否检查装备栏
     */
    static countOne(target: Item | string, checkEquipmentSlot: boolean = true): number {
        const itemName = target instanceof Item ? target.name : target;
        let count = this.STOREHOUSE.get(itemName)?.count ?? 0;
        if (checkEquipmentSlot) {
            if (Array.from(this.equipmentMap.values()).some(stack => stack.item?.name === itemName)) {
                count += 1;
            }
        }
        return count;
    }

    /**
     * 取出物品
     *
     * @param requireList 需求物品列表
     * @return 是否成功
     */
    static tackOut(requireList: ItemStack[]): boolean {
        for (const require of requireList) {
            if (this.STOREHOUSE.has(require.item.name)) {
                const store = this.STOREHOUSE.get(require.item.name);
                if (store.count < require.count) {
                    return false;
                }
                store.count -= require.count;
                if (store.count <= 0) {
                    this.STOREHOUSE.delete(require.item.name);
                }
            } else {
                return false;
            }
        }

        Storehouse.emitUpdateEvent(requireList);
        return true;
    }

    /**
     * 取出一件物品
     *
     * @param itemName 物品名称
     * @return 是否成功
     */
    static tackOutOne(itemName: string): boolean {
        const itemStack = this.STOREHOUSE.get(itemName);
        if (!itemStack) {
            return false;
        }
        itemStack.count -= 1;
        if (itemStack.count <= 0) {
            this.STOREHOUSE.delete(itemName);
        }
        Storehouse.emitUpdateEvent([{ item: itemStack.item, count: 1 }]);
        return true;
    }

    /**
     * 检查物品是否在装备栏内
     *
     * @param item 物品
     */
    private static inEquipmentSlot(item: Item): boolean {
        if (item.itemType !== ItemType.EQUIPMENT) {
            // 跳过非装备物品
            return false;
        }

        return Array.from(Storehouse.equipmentMap.values()).some(stack => stack.item?.name === item.name)
    }

    /**
     * 发送仓库更新事件
     *
     * @param stackList 更新物品列表
     */
    private static emitUpdateEvent(stackList: ItemStack[]) {
        // 发送被更新的物品的现有库存情况，避免修改stackList数据
        const updateStacks: ItemStack[] = [];
        stackList.forEach(stack => updateStacks.push(new ItemStack(stack.item, this.STOREHOUSE.get(stack.item.name)?.count ?? 0)));
        EventCenter.emit(EventName.UI_UPDATE_STOREHOUSE, updateStacks);
    }

    /**
     * 获取装备栏
     */
    private static get equipmentMap(): Map<EquipmentType, ItemStack> {
        if (!Storehouse._equipmentSlot) {
            Storehouse._equipmentSlot = PlayerController.PLAYER.equipments.equipmentMap;
        }
        return Storehouse._equipmentSlot;
    }
}
