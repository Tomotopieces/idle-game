import { _decorator, Component, Label, Layout, Sprite, SpriteFrame } from "cc";
import {
    Item,
    ITEM_RARITY_COLOR_MAP,
    ITEM_RARITY_DISPLAY_NAME_MAP,
    ItemRarity,
    ItemType
} from "db://assets/Script/Item/Item";
import { ResourceManager, ResourceType } from "db://assets/Script/ResourceManager";
import { Equipment, EquipmentType } from "db://assets/Script/Equipment/Equipment";
import { SET_EFFECT_TABLE, UNIQUE_EFFECT_TABLE } from "db://assets/Script/DataTable";

const { ccclass } = _decorator;

/**
 * 物品信息UI
 */
@ccclass("ItemInfoUI")
export class ItemInfoUI extends Component {
    /**
     * Layout 组件
     */
    private _layout: Layout;

    /**
     * 图标 Sprite
     */
    private _iconSprite: Sprite;

    /**
     * 名称 Label
     */
    private _nameLabel: Label;

    /**
     * 类型 Label
     */
    private _typeLabel: Label;

    /**
     * 品质 Label
     */
    private _rarityLabel: Label;

    /**
     * 描述 Label
     */
    private _descriptionLabel: Label;

    /**
     * 属性 Label
     */
    private _attributesLabel: Label;

    /**
     * 独门妙用 Label
     */
    private _uniqueEffectLabel: Label;

    /**
     * 套装效果 Label
     */
    private _setEffectLabel: Label;

    onLoad() {
        // Layout
        this._layout = this.getComponent(Layout);

        // 基础信息
        const baseInfoNode = this.node.getChildByName('BaseInfo');
        this._iconSprite = baseInfoNode.getChildByName('Icon').getComponent(Sprite);
        this._nameLabel = baseInfoNode.getChildByName('Name').getComponent(Label);
        this._typeLabel = baseInfoNode.getChildByName('Type').getComponent(Label);
        this._rarityLabel = baseInfoNode.getChildByName('Rarity').getComponent(Label);

        // 物品介绍
        this._descriptionLabel = this.node.getChildByName('Description').getComponent(Label);

        // 装备信息
        const weaponInfoNode = this.node.getChildByName('WeaponInfo');
        this._attributesLabel = weaponInfoNode.getChildByName('Attributes').getComponent(Label);
        this._uniqueEffectLabel = weaponInfoNode.getChildByName('UniqueEffect').getComponent(Label);
        this._setEffectLabel = weaponInfoNode.getChildByName('SetEffect').getComponent(Label);
    }

    /**
     * 显示物品信息
     *
     * @param item                          物品
     * @param rarity                        物品品质，默认为物品原始品质
     * @param showSetEffectActivationStatus 是否显示套装效果激活状态，默认为 true
     */
    show(item: Item, rarity: ItemRarity = item.rarity, showSetEffectActivationStatus: boolean = true) {
        // 基础信息
        ResourceManager.loadAsset(ResourceType.SPRITE_FRAME, item.icon, (spriteFrame: SpriteFrame) => {
            this._iconSprite.spriteFrame = spriteFrame;
        });
        this._nameLabel.string = item.displayName;
        this._typeLabel.string = ItemInfoUI.typeLabel(item);
        this._rarityLabel.string = ITEM_RARITY_DISPLAY_NAME_MAP.get(rarity);
        this._nameLabel.color = this._typeLabel.color = this._rarityLabel.color = ITEM_RARITY_COLOR_MAP.get(rarity);

        // 物品介绍
        this._descriptionLabel.string = item.description;

        // 装备信息
        if (item instanceof Equipment) {
            this._attributesLabel.string = ItemInfoUI.attributesText(item, rarity);
            this._attributesLabel.node.active = !!this._attributesLabel.string;
            this._uniqueEffectLabel.string = ItemInfoUI.uniqueEffectText(item);
            this._uniqueEffectLabel.node.active = !!this._uniqueEffectLabel.string;
            this._setEffectLabel.string = ItemInfoUI.setEffectText(item, showSetEffectActivationStatus);
            this._setEffectLabel.node.active = !!this._setEffectLabel.string;
        } else {
            this._attributesLabel.node.active = false;
            this._uniqueEffectLabel.node.active = false;
            this._setEffectLabel.node.active = false;
        }

        // 更新Layout
        this._layout.updateLayout(true);
    }

    /**
     * 装备属性信息
     *
     * @param equipment 装备
     * @param rarity    显示的品质，默认为物品当前品质
     * @return 装备属性信息
     */
    private static attributesText(equipment: Equipment, rarity: ItemRarity): string {
        return [
            equipment.attributes.additionalHealth ? `+${equipment.attributes.additionalHealth} 最大生命` : ``,
            equipment.attributes.healthBoost ? `+${equipment.attributes.healthBoost * 100}% 生命加成` : ``,
            equipment.attributes.extraHealth ? `+${equipment.attributes.extraHealth} 额外生命` : ``,
            equipment.attributes.additionalDamage ? `+${equipment.attributes.additionalDamage} 伤害` : ``,
            equipment.attributes.damageBoost ? `+${equipment.attributes.damageBoost * 100}% 伤害加成` : ``,
            equipment.attributes.additionalDefense ? `+${equipment.attributes.getAdditionalDefense(rarity)} 防御` : ``,
            equipment.attributes.defenseBoost ? `+${equipment.attributes.defenseBoost * 100}% 防御加成` : ``,
            equipment.attributes.criticalRate ? `+${equipment.attributes.criticalRate * 100}% 暴击率` : ``,
            equipment.attributes.criticalBoost ? `+${equipment.attributes.criticalBoost}% 暴击伤害加成` : ``
        ].filter(text => !!text).join('\n');
    }

    /**
     * 装备独门妙用信息
     *
     * @param equipment 装备
     * @return 装备独门妙用信息
     */
    private static uniqueEffectText(equipment: Equipment): string {
        const description = UNIQUE_EFFECT_TABLE.get(equipment.name)?.description;
        return description ? `独门妙用：\n${description}` : ``;
    }

    /**
     * 装备套装效果信息
     *
     * @param equipment            装备
     * @param showActivationStatus 是否显示套装效果激活状态
     * @return 套装效果信息
     */
    private static setEffectText(equipment: Equipment, showActivationStatus: boolean = true): string {
        const setEffect = SET_EFFECT_TABLE.get(equipment.attributes.setName);
        return setEffect ?
            `套装效果：` + Array.from(setEffect.levelEffectMap.entries())
                .map(([level, effect]) =>
                    `\nLv.${level}：${effect.description} ${showActivationStatus ? effect.active ? '✔' : '❌' : ''}`)
                .join('') :
            ``;
    }

    /**
     * 获取物品类型标签
     *
     * @param item 物品
     */
    private static typeLabel(item: Item): string {
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