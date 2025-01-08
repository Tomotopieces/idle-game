import { _decorator, Component, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, Widget } from 'cc';
import { CraftRecipe } from "db://assets/Script/Recipe/CraftRecipe";
import { ResourceManager, ResourceType } from "db://assets/Script/ResourceManager";
import { ITEM_RARITY_COLOR_MAP, ITEM_RARITY_DISPLAY_NAME_MAP } from "db://assets/Script/Item/Item";
import { EquipmentInfoUIUtil } from "db://assets/Script/Util/EquipmentInfoUIUtil";
import { RecipeRequirementUI } from "db://assets/Script/UI/Craft/RecipeRequirementUI";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { Recipe } from "db://assets/Script/Recipe/Recipe";
import { UpgradeRecipe } from "db://assets/Script/Recipe/UpgradeRecipe";

const { ccclass, property } = _decorator;

/**
 * 配方信息
 */
@ccclass('RecipeInfo')
export class RecipeInfo extends Component {
    /**
     * 配方需求预制体
     */
    @property({ type: Prefab, tooltip: '配方需求预制体' })
    requirementPrefab: Prefab;

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
     * 配方需求Node
     */
    private _requirementsNode: Node;

    /**
     * 需求UI Map
     *
     * 物品名称 -> 需求UI
     */
    private _requirementMap = new Map<string, RecipeRequirementUI>();

    /**
     * 配方
     */
    private _recipe: CraftRecipe;

    onLoad() {
        const itemInfoLayout = this.node.getChildByName('ItemInfoLayout');

        const baseInfoNode = itemInfoLayout.getChildByName('BaseInfo');
        this._itemIconSprite = baseInfoNode.getChildByName('Icon').getComponent(Sprite);
        this._itemNameLabel = baseInfoNode.getChildByName('Name').getComponent(Label);
        this._itemTypeLabel = baseInfoNode.getChildByName('Type').getComponent(Label);
        this._itemRarityLabel = baseInfoNode.getChildByName('Rarity').getComponent(Label);

        this._itemDescriptionLabel = itemInfoLayout.getChildByName('Description').getComponent(Label);

        const weaponInfoNode = itemInfoLayout.getChildByName('WeaponInfo');
        this._weaponAttributesLabel = weaponInfoNode.getChildByName('Attributes').getComponent(Label);
        this._weaponUniqueEffectLabel = weaponInfoNode.getChildByName('UniqueEffect').getComponent(Label);
        this._weaponSetEffectLabel = weaponInfoNode.getChildByName('SetEffect').getComponent(Label);

        this._requirementsNode = this.node.getChildByName('Requirements');

        EventCenter.on(EventName.UI_UPDATE_STOREHOUSE, this.node.name, (stackList: ItemStack[]) => this.handleStorehouseUpdate(stackList));
    }

    onDestroy() {
        EventCenter.idOff(this.node.name);
    }

    /**
     * 显示
     *
     * @param recipe 配方
     */
    show(recipe: Recipe) {
        this.node.active = true;
        this._recipe = recipe;
        const item = recipe.product;
        const rarity = recipe instanceof UpgradeRecipe ? recipe.productRarity : item.rarity;

        // 基本信息
        this._itemIconSprite.spriteFrame = ResourceManager.getAsset(ResourceType.SPRITE_FRAME, recipe.product.icon) as SpriteFrame;
        if (!this._itemIconSprite.spriteFrame) {
            ResourceManager.loadAsset(ResourceType.SPRITE_FRAME, recipe.product.icon, (spriteFrame: SpriteFrame) => {
                this._itemIconSprite.spriteFrame = spriteFrame;
            });
        }
        this._itemNameLabel.string = recipe.product.displayName;
        this._itemTypeLabel.string = EquipmentInfoUIUtil.getItemTypeLabel(recipe.product);
        this._itemRarityLabel.string = ITEM_RARITY_DISPLAY_NAME_MAP.get(rarity);
        this._itemNameLabel.color = this._itemTypeLabel.color = this._itemRarityLabel.color = ITEM_RARITY_COLOR_MAP.get(rarity);

        this._itemDescriptionLabel.string = recipe.product.description;

        // 装备属性
        this._weaponAttributesLabel.string = EquipmentInfoUIUtil.getAttributes(item, rarity);
        this._weaponAttributesLabel.node.active = !!this._weaponAttributesLabel.string;
        this._weaponUniqueEffectLabel.string = EquipmentInfoUIUtil.getUniqueEffect(item);
        this._weaponUniqueEffectLabel.node.active = !!this._weaponUniqueEffectLabel.string;
        this._weaponSetEffectLabel.string = EquipmentInfoUIUtil.getSetEffect(item, false);
        this._weaponSetEffectLabel.node.active = !!this._weaponSetEffectLabel.string;

        // 需求列表
        this._requirementsNode.removeAllChildren();
        recipe.requirements.forEach(requirement => {
            const node = instantiate(this.requirementPrefab);
            this._requirementsNode.addChild(node);
            const requirementUI = node.getComponent(RecipeRequirementUI);
            requirementUI.init(requirement);
            this._requirementMap.set(requirement.item.name, requirementUI);
        });

        this._requirementsNode.getComponent(Widget).bottom = 0;
    }

    /**
     * 隐藏
     */
    hide() {
        this.node.active = false;
    }

    /**
     * 处理仓库更新事件
     *
     * @param stackList 更新物品列表
     */
    private handleStorehouseUpdate(stackList: ItemStack[]) {
        if (!this.node.active || !this._recipe) {
            return;
        }

        this._recipe.requirements.forEach(requirement => {
            const stack = stackList.find(stack => stack.item.name === requirement.item.name);
            stack && this._requirementMap.get(requirement.item.name).updateCount();
        });
    }
}
