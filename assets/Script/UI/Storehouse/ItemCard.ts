import { _decorator, Component, Layout, Node, Sprite, SpriteFrame, UITransform, Vec3, view, Widget } from 'cc';
import { Item } from "db://assets/Script/Item/Item";
import { EMPTY_FUNCTION, Runnable } from "db://assets/Script/Util/Functions";
import { Equipment } from "db://assets/Script/Equipment/Equipment";
import { ItemInfoUI } from "db://assets/Script/Prefab/ItemInfoUI";

const { ccclass } = _decorator;

/**
 * 物品卡片
 */
@ccclass('ItemCard')
export class ItemCard extends Component {
    /**
     * 自身 Transform
     */
    private _transform: UITransform;

    /**
     * 物品信息
     */
    private _itemInfo: ItemInfoUI;

    /**
     * 物品信息 Widget
     */
    private _itemInfoWidget: Widget;

    /**
     * 按钮 Widget
     */
    private _operationWidget: Widget;

    /**
     * 按钮
     */
    private _operationButton: Node;

    /**
     * 按钮图标
     */
    private _buttonSprite: Sprite;

    /**
     * 点击事件
     */
    private _onClick: Runnable;

    onLoad() {
        this._transform = this.node.getComponent(UITransform);

        this._itemInfo = this.node.getChildByName('ItemInfo').getComponent(ItemInfoUI);
        this._itemInfoWidget = this._itemInfo.getComponent(Widget);

        const OperationNode = this.node.getChildByName('Operation');
        this._operationWidget = OperationNode.getComponent(Widget);
        this._operationButton = OperationNode.getChildByName('Button');
        this._buttonSprite = this._operationButton.getChildByName('Sprite').getComponent(Sprite);
    }

    /**
     * 显示
     *
     * @param targetWorldPosition 目标世界坐标
     * @param item                卡片物品
     * @param onClick             按钮点击事件
     * @param buttonImage         按钮图标
     */
    show(targetWorldPosition: Vec3, item: Item, onClick: Runnable, buttonImage: SpriteFrame) {
        this.node.active = true;

        // 设置卡片位置与锚点
        const designSize = view.getDesignResolutionSize();
        this._transform.anchorX = targetWorldPosition.x + this._transform.width <= designSize.width ? 0 : 1;
        this._transform.anchorY = targetWorldPosition.y - this._transform.height >= 0 ? 1 : 0;
        this.node.setWorldPosition(targetWorldPosition);

        // 设置物品信息
        const rarity = item instanceof Equipment ? item.attributes.rarity : item.rarity;
        this._itemInfo.show(item, rarity);

        // 设置按钮内容
        this._buttonSprite.spriteFrame = buttonImage;
        this._operationButton.active = onClick !== EMPTY_FUNCTION;
        this._onClick = onClick;

        this.getComponent(Layout).updateLayout(true);
        this._itemInfoWidget.updateAlignment();
        this._operationWidget.updateAlignment();
    }

    /**
     * 隐藏
     */
    hide() {
        this.node.active = false;
    }

    /**
     * 点击卡片
     *
     * 按钮触发
     */
    clickCard() {
        this.hide();
    }

    /**
     * 点击按钮
     *
     * 按钮触发
     */
    clickButton() {
        if (this._onClick) {
            this._onClick();
        }
        this.hide();
    }
}
