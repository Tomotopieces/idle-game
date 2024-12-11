import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";
import { Storehouse } from "db://assets/Script/Util/StorehouseUtil";
import { ItemSlot } from "db://assets/Script/UI/Storehouse/ItemSlot";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { EventCenter } from "db://assets/Script/Event/EventCenter";

const { ccclass, property } = _decorator;

// 默认仓库格子数量
const DEFAULT_SLOT_SIZE = 30;

// 容器宽度
const CONTAINER_WIDTH = 720;

// 每行物品槽数量
const SLOT_PER_ROW = 5;

// 每格物品槽宽度
const SLOT_SIZE = CONTAINER_WIDTH / SLOT_PER_ROW;

/**
 * 仓库容器UI
 */
@ccclass('ItemSlotContainer')
export class ItemSlotContainer extends Component {
    /**
     * 物品槽Prefab
     */
    @property({ type: Prefab, tooltip: '物品槽Prefab' })
    slotPrefab: Prefab = null;

    /**
     * 仓库
     */
    private _storehouse: Storehouse;

    /**
     * 物品槽列表
     */
    private _slotList: Array<Node> = [];

    start() {
        // TODO 改为使用 Layout 组件进行排版，重新设计排版逻辑
        // 获取仓库内容
        this._storehouse = GlobalState.getState(GlobalStateName.STOREHOUSE);

        // 计算展示的物品槽数量，确保每行都填满
        let slotCount = Math.max(this._storehouse.size, DEFAULT_SLOT_SIZE);
        slotCount += SLOT_PER_ROW - slotCount % SLOT_PER_ROW;

        // 添加物品槽
        const stackList = Array.from(this._storehouse.values());
        for (let i = 0; i < slotCount; i++) {
            const slot = instantiate(this.slotPrefab);
            this.node.addChild(slot);

            // 设置slot位置
            slot.setPosition(ItemSlotContainer.calculatePosition(i));

            // 设置slot内容
            if (i < stackList.length) {
                slot.getComponent(ItemSlot).stack = stackList[i];
                this._slotList.push(slot);
            }
        }

        // 监听仓库变化事件
        EventCenter.on(EventName.UI_UPDATE_STOREHOUSE, this.node.name, (stackList: Array<ItemStack>) => this.updateSlotList(stackList));
    }

    /**
     * 更新物品槽
     *
     * @param stackList 更新物品列表
     */
    private updateSlotList(stackList: Array<ItemStack>) {
        // 更新List数据
        stackList.forEach(updateStack => {
            const index = this._slotList.findIndex(slot => slot.getComponent(ItemSlot).stack?.item.name === updateStack.item.name ?? false);
            if (index == -1 && updateStack.count > 0) {
                // 新增物品
                const slot = instantiate(this.slotPrefab);
                slot.getComponent(ItemSlot).stack = updateStack;
                this._slotList.push(slot);
                // 跳过数量为0的新物品
            } else if (updateStack.count > 0) {
                // 修改物品数量
                this._slotList[index].getComponent(ItemSlot).stack = updateStack;
            } else {
                // 删除物品
                this._slotList.splice(index, 1);
            }
        });

        // 更新UI
        this.updateSlotUI();
    }

    /**
     * 更新物品槽UI
     */
    private updateSlotUI() {
        // 清空
        this.node.removeAllChildren();

        // 重新计算展示的物品槽数量
        let slotCount = Math.max(this._storehouse.size, DEFAULT_SLOT_SIZE);
        slotCount += SLOT_PER_ROW - slotCount % SLOT_PER_ROW;

        for (let i = 0; i < slotCount; i++) {
            const slot = i < this._slotList.length ? this._slotList[i] : instantiate(this.slotPrefab);
            this.node.addChild(slot);
            slot.setPosition(ItemSlotContainer.calculatePosition(i));
        }
    }

    /**
     * 计算物品槽在UI中的位置
     *
     * @param index 物品顺序索引
     */
    private static calculatePosition(index: number): Vec3 {
        const rowIndex = Math.floor(index / SLOT_PER_ROW);
        const columnIndex = index % SLOT_PER_ROW;
        const x = (columnIndex + 0.5) * SLOT_SIZE;
        const y = -(rowIndex + 0.5) * SLOT_SIZE;
        return new Vec3(x, y);
    }
}


