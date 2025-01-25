import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { Item } from "db://assets/Script/Item/Item";
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
     * 通过UUID搜索物品
     *
     * @param uuid UUID
     * @return {Item} UUID相匹配的物品
     */
    static searchUUID(uuid: string): Item {
        return Array.from(this.STOREHOUSE.values()).find(stack => stack.item.uuid === uuid)?.item;
    }

    /**
     * 根据ID排序
     *
     * @return {ItemStack[]} 排序后的物品列表
     */
    static sorted(): ItemStack[] {
        return Array.from(this.STOREHOUSE.values()).sort((a, b) => a.item.id - b.item.id);
    }

    /**
     * 放入物品
     *
     * @param stackList   存放物品列表
     * @param showMessage 是否进行消息提示
     */
    static putIn(stackList: ItemStack[], showMessage: boolean = true) {
        const failedList: ItemStack[] = [];
        stackList.forEach(stack => {
            if (this.STOREHOUSE.has(stack.item.name)) {
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
     * @param stackList 需求物品列表
     */
    static satisfy(stackList: ItemStack[]): boolean {
        return stackList.every(stack => (this.STOREHOUSE.get(stack.item.name)?.count ?? 0) >= stack.count);
    }

    /**
     * 统计物品数量
     *
     * @param target 目标物品 | 名称
     */
    static count(target: Item | string): number {
        return this.STOREHOUSE.get(target instanceof Item ? target.name : target)?.count ?? 0;
    }

    /**
     * 取出物品
     *
     * @param requireList 需求物品列表
     */
    static takeOut(requireList: ItemStack[]) {
        if (!this.satisfy(requireList)) {
            return;
        }

        for (const require of requireList) {
            if (this.STOREHOUSE.has(require.item.name)) {
                const stack = this.STOREHOUSE.get(require.item.name);
                stack.count -= require.count;
                if (stack.count <= 0) {
                    this.STOREHOUSE.delete(require.item.name);
                }
            }
        }

        Storehouse.emitUpdateEvent(requireList);
    }

    /**
     * 发送仓库更新事件
     *
     * @param stackList 更新物品列表
     */
    private static emitUpdateEvent(stackList: ItemStack[]) {
        // 发送被更新的物品的现有库存情况，避免修改stackList数据
        const updateStacks = stackList.map(stack => this.STOREHOUSE.get(stack.item.name) || ItemStack.of(stack.item, 0));
        EventCenter.emit(EventName.UI_UPDATE_STOREHOUSE, updateStacks);
    }
}
