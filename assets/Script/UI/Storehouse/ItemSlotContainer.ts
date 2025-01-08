import { _decorator, Component, instantiate, Prefab } from 'cc';
import { ItemSlot } from "db://assets/Script/UI/Storehouse/ItemSlot";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";

const { ccclass, property } = _decorator;

// 默认仓库格子数量
const DEFAULT_SLOT_SIZE = 35;

// 每行物品槽数量
const SLOT_PER_ROW = 5;

/**
 * 仓库容器UI
 */
@ccclass('ItemSlotContainer')
export class ItemSlotContainer extends Component {
    /**
     * 物品槽Prefab
     */
    @property({ type: Prefab, displayName: '物品槽Prefab' })
    slotPrefab: Prefab;

    /**
     * 显示物品列表
     */
    private readonly _displayStacks: ItemStack[] = [];

    /**
     * 物品槽列表
     */
    private readonly _slots: ItemSlot[] = [];

    onLoad() {
        for (let i = 0; i < DEFAULT_SLOT_SIZE; i++) {
            const slot = instantiate(this.slotPrefab);
            this.node.addChild(slot);
            this._slots.push(slot.getComponent(ItemSlot));
        }

        // 监听仓库变化事件
        EventCenter.on(EventName.UI_UPDATE_STOREHOUSE, this.node.name, (deltaList: ItemStack[]) => this.updateDisplayList(deltaList));
    }

    onDestroy() {
        EventCenter.idOff(this.node.name);
    }

    /**
     * 更新显示物品列表
     *
     * @param deltaList 更新物品列表
     */
    private updateDisplayList(deltaList: ItemStack[]) {
        // 更新List数据
        deltaList.forEach(updateStack => {
            const index = this._displayStacks.findIndex(stack => stack.item.name === updateStack.item.name);
            if (index == -1 && updateStack.count > 0) {
                // 新增物品
                this.push(updateStack);
            } else if (updateStack.count > 0) {
                // 修改物品数量
                this.updateCount(updateStack);
            } else {
                // 删除物品
                this.remove(index);
            }
        });
    }

    /**
     * 新增物品
     *
     * @param stack 物品堆叠
     */
    private push(stack: ItemStack) {
        if (this._displayStacks.length < this._slots.length) {
            // 寻找第一个没有内容的slot，填入stack
            for (let i = 0; i < this._slots.length; i++) {
                if (!this._slots[i].stack) {
                    this._slots[i].stack = stack;
                    break;
                }
            }
        } else {
            // 添加一行slot，并在第一个中填入stack
            for (let i = 0; i < SLOT_PER_ROW; i++) {
                const slot = instantiate(this.slotPrefab);
                this.node.addChild(slot);
                this._slots.push(slot.getComponent(ItemSlot));

                if (i === 0) {
                    slot.getComponent(ItemSlot).stack = stack;
                }
            }
        }
        this._displayStacks.push(stack);
    }

    /**
     * 更新物品数量
     *
     * @param stack 物品堆叠
     */
    private updateCount(stack: ItemStack) {
        this._slots.forEach(slot => {
            if (slot.stack?.item.name === stack.item.name) {
                slot.count = stack.count;
            }
        });
    }

    /**
     * 删除物品
     *
     * @param index 删除物品索引
     */
    private remove(index: number) {
        const stack = this._displayStacks.splice(index, 1)[0];
        index = this._slots.findIndex(slot => slot.stack?.item.name === stack.item.name);
        const slot = this._slots.splice(index, 1)[0];
        this.node.removeChild(slot.node);

        const newSlot = instantiate(this.slotPrefab);
        this.node.addChild(newSlot);
        this._slots.push(newSlot.getComponent(ItemSlot));
    }
}
