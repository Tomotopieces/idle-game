import { _decorator, Component, Label, Layout, Node, Sprite, SpriteFrame, UITransform, Vec3, view } from 'cc';
import { Item, ITEM_RARITY_COLOR_MAP, ITEM_RARITY_DISPLAY_NAME_MAP } from "db://assets/Script/Item/Item";
import { ResourceManager, ResourceType } from "db://assets/Script/ResourceManager";
import { EMPTY_FUNCTION, Runnable } from "db://assets/Script/Util/Functions";
import { EquipmentInfoUIUtil } from "db://assets/Script/Util/EquipmentInfoUIUtil";
import { Equipment } from "db://assets/Script/Item/Equipment/Equipment";

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
     * 物品图标
     */
    private _itemIconSprite: Sprite;

    /**
     * 物品名称
     */
    private _itemNameLabel: Label;

    /**
     * 物品类型
     */
    private _itemTypeLabel: Label;

    /**
     * 物品品质
     */
    private _itemRarityLabel: Label;

    /**
     * 物品描述
     */
    private _itemDescriptionLabel: Label;

    /**
     * 武器属性
     */
    private _weaponAttributesLabel: Label;

    /**
     * 武器独门妙用
     */
    private _weaponUniqueEffectLabel: Label;

    /**
     * 武器套装效果
     */
    private _weaponSetEffectLabel: Label;

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
        /* 读取所有组件 */

        this._transform = this.node.getComponent(UITransform);

        const baseInfoNode = this.node.getChildByName('BaseInfo');
        this._itemIconSprite = baseInfoNode.getChildByName('Icon').getComponent(Sprite);
        this._itemNameLabel = baseInfoNode.getChildByName('Name').getComponent(Label);
        this._itemTypeLabel = baseInfoNode.getChildByName('Type').getComponent(Label);
        this._itemRarityLabel = baseInfoNode.getChildByName('Rarity').getComponent(Label);

        this._itemDescriptionLabel = this.node.getChildByName('Description').getComponent(Label);

        const weaponInfoNode = this.node.getChildByName('WeaponInfo');
        this._weaponAttributesLabel = weaponInfoNode.getChildByName('Attributes').getComponent(Label);
        this._weaponUniqueEffectLabel = weaponInfoNode.getChildByName('UniqueEffect').getComponent(Label);
        this._weaponSetEffectLabel = weaponInfoNode.getChildByName('SetEffect').getComponent(Label);

        const OperationNode = this.node.getChildByName('Operation');
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
        const resolutionSize = view.getDesignResolutionSize();
        this._transform.anchorX = targetWorldPosition.x + this._transform.width <= resolutionSize.width ? 0 : 1;
        this._transform.anchorY = targetWorldPosition.y - this._transform.height >= 0 ? 1 : 0;
        this.node.setWorldPosition(targetWorldPosition);

        // 设置基本信息
        this._itemIconSprite.spriteFrame = ResourceManager.getAsset(ResourceType.SPRITE_FRAME, item.icon) as SpriteFrame;
        this._itemNameLabel.string = item.displayName;
        this._itemTypeLabel.string = EquipmentInfoUIUtil.getItemTypeLabel(item);
        const rarity = item instanceof Equipment ? item.attributes.rarity : item.rarity;
        this._itemRarityLabel.string = ITEM_RARITY_DISPLAY_NAME_MAP.get(rarity);
        this._itemNameLabel.color = this._itemTypeLabel.color = this._itemRarityLabel.color = ITEM_RARITY_COLOR_MAP.get(rarity);

        // 设置物品描述
        this._itemDescriptionLabel.string = item.description;

        // 设置显示信息
        this._weaponAttributesLabel.string = EquipmentInfoUIUtil.getAttributes(item, rarity);
        this._weaponAttributesLabel.node.active = !!this._weaponAttributesLabel.string;
        this._weaponUniqueEffectLabel.string = EquipmentInfoUIUtil.getUniqueEffect(item);
        this._weaponUniqueEffectLabel.node.active = !!this._weaponUniqueEffectLabel.string;
        this._weaponSetEffectLabel.string = EquipmentInfoUIUtil.getSetEffect(item);
        this._weaponSetEffectLabel.node.active = !!this._weaponSetEffectLabel.string;

        // 设置按钮内容
        this._buttonSprite.spriteFrame = buttonImage;
        this._operationButton.active = onClick !== EMPTY_FUNCTION;
        this._onClick = onClick;

        this.getComponent(Layout).updateLayout(true);
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
