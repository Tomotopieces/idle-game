import { _decorator, Component, Label, Layout, Node, Sprite, SpriteFrame, UITransform, Vec3, view } from 'cc';
import { DO_NOTHING, Runnable } from "db://assets/Script/Util/Constant";
import { Item, ITEM_QUALITY_DISPLAY_NAME_MAP, ItemType } from "db://assets/Script/Item/Item";
import { ResourceManager, ResourceType } from "db://assets/Script/ResourceManager";
import { Equipment, EquipmentType } from "db://assets/Script/Item/Equipment/Equipment";
import { UNIQUE_EFFECT_MAP } from "db://assets/Script/Item/Equipment/UniqueEffect/UniqueEffectMap";
import { SET_EFFECT_MAP } from "db://assets/Script/Item/Equipment/SetEffect/SetEffectMap";

const { ccclass, executeInEditMode } = _decorator;

/**
 * 物品卡片
 */
@ccclass('ItemCard')
@executeInEditMode(true)
export class ItemCard extends Component {
    /**
     * 信息 Layout
     */
    private _infoLayout: Node;

    /**
     * 信息 Layout Transform
     */
    private _infoLayoutTransform: UITransform;

    /**
     * 自身 Transform
     */
    private _transform: UITransform;

    /**
     * 背景 Transform
     */
    private _backgroundTransform: UITransform;

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
    private _itemQualityLabel: Label;

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

        this._infoLayout = this.node.getChildByName('InfoLayout');
        this._infoLayoutTransform = this._infoLayout.getComponent(UITransform);
        this._transform = this.node.getComponent(UITransform);
        this._backgroundTransform = this.node.getChildByName('Background').getComponent(UITransform);

        this._itemIconSprite = this._infoLayout.getChildByName('Icon').getComponent(Sprite);

        const baseInfoNode = this._infoLayout.getChildByName('BaseInfo');
        this._itemNameLabel = baseInfoNode.getChildByName('Name').getComponent(Label);
        this._itemTypeLabel = baseInfoNode.getChildByName('Type').getComponent(Label);
        this._itemQualityLabel = baseInfoNode.getChildByName('Quality').getComponent(Label);

        const weaponInfoNode = this._infoLayout.getChildByName('WeaponInfo');
        this._weaponAttributesLabel = weaponInfoNode.getChildByName('Attributes').getComponent(Label);
        this._weaponUniqueEffectLabel = weaponInfoNode.getChildByName('UniqueEffect').getComponent(Label);
        this._weaponSetEffectLabel = weaponInfoNode.getChildByName('SetEffect').getComponent(Label);

        this._operationButton = this._infoLayout.getChildByName('Operation').getChildByName('Button');
        this._buttonSprite = this._operationButton.getChildByName('Sprite').getComponent(Sprite);
    }

    update(_dt: number) {
        // 自动调整卡片大小，与信息Layout同步
        this._backgroundTransform.width = this._transform.width = this._infoLayoutTransform.width;
        this._backgroundTransform.height = this._transform.height = this._infoLayoutTransform.height;
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
        this._backgroundTransform.anchorX =
            this._infoLayoutTransform.anchorX =
                this._transform.anchorX =
                    targetWorldPosition.x + this._transform.width <= resolutionSize.width ? 0 : 1;
        this._backgroundTransform.anchorY =
            this._infoLayoutTransform.anchorY =
                this._transform.anchorY =
                    targetWorldPosition.y - this._transform.height >= 0 ? 1 : 0;
        this.node.setWorldPosition(targetWorldPosition);

        // 设置基本信息
        this._itemIconSprite.spriteFrame = ResourceManager.getAsset(ResourceType.SPRITE_FRAME, item.icon) as SpriteFrame;
        this._itemNameLabel.string = item.displayName;
        this._itemTypeLabel.string = this.getItemTypeLabel(item);
        this._itemQualityLabel.string = ITEM_QUALITY_DISPLAY_NAME_MAP.get(item.quality);

        // 设置显示信息
        this.setAttributes(item);
        this.setUniqueEffect(item);
        this.setSetEffect(item);

        // 设置按钮内容
        this._buttonSprite.spriteFrame = buttonImage;
        this._operationButton.active = onClick !== DO_NOTHING;
        this._onClick = onClick;

        // 更新 Layout
        this._infoLayout.getComponent(Layout).updateLayout(true);
    }

    /**
     * 设置物品属性信息
     *
     * @param item 物品
     */
    setAttributes(item: Item): void {
        if (!(item instanceof Equipment)) {
            this._weaponAttributesLabel.node.active = false;
            this._weaponAttributesLabel.string = ``;
            return;
        }

        const equipment = item as Equipment;
        let displayResult = ``;
        displayResult += equipment.attributes.additionalHealth ? `+${equipment.attributes.additionalHealth} 最大生命\n` : ``;
        displayResult += equipment.attributes.healthBoost ? `+${equipment.attributes.healthBoost * 100}% 生命加成\n` : ``;
        displayResult += equipment.attributes.extraHealth ? `+${equipment.attributes.extraHealth} 额外生命\n` : ``;
        displayResult += equipment.attributes.additionalDamage ? `+${equipment.attributes.additionalDamage} 伤害\n` : ``;
        displayResult += equipment.attributes.damageBoost ? `+${equipment.attributes.damageBoost * 100}% 伤害加成\n` : ``;
        displayResult += equipment.attributes.additionalDefense ? `+${equipment.attributes.additionalDefense} 防御\n` : ``;
        displayResult += equipment.attributes.defenseBoost ? `+${equipment.attributes.defenseBoost * 100}% 防御加成\n` : ``;
        displayResult += equipment.attributes.criticalRate ? `+${equipment.attributes.criticalRate * 100}% 暴击率\n` : ``;
        displayResult += equipment.attributes.criticalBoost ? `+${equipment.attributes.criticalBoost}% 暴击伤害加成\n` : ``;
        if (displayResult.endsWith('\n')) {
            displayResult = displayResult.slice(0, -1);
        }

        this._weaponAttributesLabel.node.active = !!displayResult;
        this._weaponAttributesLabel.string = displayResult;
    }

    /**
     * 设置独门妙用信息
     *
     * @param item 物品
     */
    setUniqueEffect(item: Item): void {
        if (!(item instanceof Equipment)) {
            this._weaponUniqueEffectLabel.node.active = false;
            this._weaponUniqueEffectLabel.string = ``;
            return;
        }

        const equipment = item as Equipment;
        const description = UNIQUE_EFFECT_MAP.get(equipment.name)?.description;

        const displayResult = description ? `独门妙用：\n\t${description}` : ``;
        this._weaponUniqueEffectLabel.node.active = !!displayResult;
        this._weaponUniqueEffectLabel.string = displayResult;
    }

    /**
     * 设置套装效果信息
     *
     * @param item 物品
     */
    setSetEffect(item: Item): void {
        if (!(item instanceof Equipment) || !(item as Equipment).attributes.setName) {
            this._weaponSetEffectLabel.node.active = false;
            this._weaponSetEffectLabel.string = ``;
            return;
        }

        const equipment = item as Equipment;
        const setEffect = SET_EFFECT_MAP.get(equipment.attributes.setName);
        let displayResult = `套装效果：${setEffect.name}`;
        setEffect.levelEffectMap.forEach((effect, level) =>
            displayResult += `\n\t${level}级：${effect.description} ${effect.active ? '✔' : '❌'}`);
        this._weaponSetEffectLabel.node.active = true;
        this._weaponSetEffectLabel.string = displayResult;
    }

    /**
     * 隐藏
     */
    hide() {
        this.node.active = false;
    }

    /**
     * 获取物品类型标签
     *
     * @param item 物品
     */
    private getItemTypeLabel(item: Item): string {
        switch (item.itemType) {
            default:
            case ItemType.COMMON:
                return '普通';
            case ItemType.CONSUMABLE:
                return '消耗品';
            case ItemType.EQUIPMENT:
                const equipment = item as Equipment;
                switch (equipment.equipmentType) {
                    default:
                    case EquipmentType.WEAPON:
                        return '披挂 - 武器';
                    case EquipmentType.HEAD:
                        return '披挂 - 头冠';
                    case EquipmentType.CHEST:
                        return '披挂 - 衣甲';
                    case EquipmentType.ARM:
                        return '披挂 - 臂甲';
                    case EquipmentType.LEG:
                        return '披挂 - 腿甲';
                    case EquipmentType.CURIOS:
                        return '披挂 - 珍玩';
                }
        }
    }
}


