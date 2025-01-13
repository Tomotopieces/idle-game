import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { CraftRecipe } from "db://assets/Script/Recipe/CraftRecipe";
import { RecipeRequirementUI } from "db://assets/Script/UI/Workshop/RecipeRequirementUI";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { Recipe } from "db://assets/Script/Recipe/Recipe";
import { UpgradeRecipe } from "db://assets/Script/Recipe/UpgradeRecipe";
import { ItemInfoUI } from "db://assets/Script/Prefab/ItemInfoUI";

const { ccclass, property } = _decorator;

/**
 * 配方信息UI
 */
@ccclass('RecipeInfoUI')
export class RecipeInfoUI extends Component {
    /**
     * 配方需求预制体
     */
    @property({ type: Prefab, tooltip: '配方需求预制体' })
    requirementPrefab: Prefab;

    /**
     * 物品信息
     */
    private _itemInfo: ItemInfoUI;

    /**
     * 配方需求 Node
     */
    private _requirementsNode: Node;

    /**
     * 需求UI Map
     *
     * 物品名称 -> 需求UI
     */
    private _requirementUIMap = new Map<string, RecipeRequirementUI>();

    /**
     * 配方
     */
    private _recipe: CraftRecipe;

    onLoad() {
        this._itemInfo = this.node.getChildByName('ItemInfo').getComponent(ItemInfoUI);
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
        this._recipe = recipe;
        const item = recipe.output;
        const rarity = recipe instanceof UpgradeRecipe ? recipe.outputRarity : item.rarity;

        // 物品信息
        this._itemInfo.show(item, rarity, false);

        // 需求列表
        this._requirementsNode.removeAllChildren();
        recipe.requirements.forEach(requirement => {
            const node = instantiate(this.requirementPrefab);
            this._requirementsNode.addChild(node);
            const requirementUI = node.getComponent(RecipeRequirementUI);
            requirementUI.init(requirement);
            this._requirementUIMap.set(requirement.item.name, requirementUI);
        });
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
     * 更新材料数量
     *
     * @param stackList 更新物品列表
     */
    private handleStorehouseUpdate(stackList: ItemStack[]) {
        if (!this.node.active || !this._recipe) {
            return;
        }

        this._recipe.requirements.forEach(requirement => {
            const stack = stackList.find(stack => stack.item.name === requirement.item.name);
            !!stack && this._requirementUIMap.get(requirement.item.name).updateCountLabel(stack.count);
        });
    }
}
