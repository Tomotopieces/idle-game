import { _decorator, Component, EventTarget, Node } from 'cc';
import { ItemOptionMenu } from "db://assets/Script/UI/ItemOptionMenu";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { ItemSlot, SlotType } from "db://assets/Script/UI/ItemSlot";
import { ItemType } from "db://assets/Script/Item/Item";

const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    /**
     * 仓库面板
     */
    @property({ type: Node, tooltip: '仓库面板' })
    storehousePanel: Node;

    /**
     * 物品选项菜单
     */
    @property({ type: ItemOptionMenu, tooltip: '物品选项菜单' })
    itemOptionMenu: ItemOptionMenu;

    /**
     * 事件中心
     */
    private _eventTarget: EventTarget;

    start() {
        this._eventTarget = GlobalState.getState(GlobalStateName.EVENT_TARGET);

        this._eventTarget.on(EventName.CLICK_ITEM_SLOT, (itemSlot: ItemSlot) => this.onClickItemSlot(itemSlot));
    }

    /**
     * 开关仓库面板
     */
    public toggleStorehousePanel() {
        if (!this.storehousePanel) {
            console.error(`[UIManager.toggleStorehousePanel] storehousePanel is null`);
            return;
        }
        this.itemOptionMenu.hide();
        this.storehousePanel.active = !this.storehousePanel.active;
    }

    /**
     * 点击物品槽
     *
     * @param itemSlot 点击的物品槽
     */
    private onClickItemSlot(itemSlot: ItemSlot) {
        // TODO 发送换装事件
        if (itemSlot.stack?.item.itemType === ItemType.EQUIPMENT) {
            const position = itemSlot.node.getWorldPosition();
            this.itemOptionMenu.showUp(position, itemSlot.slotType === SlotType.STOREHOUSE, () => console.log(itemSlot.slotType));
        } else {
            this.itemOptionMenu.hide();
        }
    }
}
