import { _decorator, Animation, Component, instantiate, Node, Prefab } from 'cc';
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { CraftRecipe } from "db://assets/Script/Recipe/CraftRecipe";
import { RecipeInfo } from "db://assets/Script/UI/Craft/RecipeInfo";
import { RECIPE_TABLE } from "db://assets/Script/DataTable";
import { RecipeSlot } from "db://assets/Script/UI/Craft/RecipeSlot";
import { RecipeUtil } from "db://assets/Script/Recipe/RecipeUtil";

const { ccclass, property } = _decorator;

/**
 * 制作面板
 */
@ccclass('CraftPanel')
export class CraftPanel extends Component {
    /**
     * 配方表Node
     */
    @property({ type: Node, tooltip: '配方表Node' })
    recipeListNode: Node;

    /**
     * 配方槽预制体
     */
    @property({ type: Prefab, tooltip: '配方槽预制体' })
    recipeSlotPrefab: Prefab;

    /**
     * 配方信息
     */
    private _recipeInfo: RecipeInfo;

    /**
     * 动画机
     */
    private _anim: Animation;

    /**
     * 是否显示
     */
    private _show = false;

    /**
     * 当前配方
     */
    private _currentRecipe: CraftRecipe;

    /**
     * 制作按钮
     */
    private _craftButton: Node;

    onLoad() {
        this._recipeInfo = this.node.getChildByName('RecipeInfo').getComponent(RecipeInfo);
        this._craftButton = this.node.getChildByName('CraftButton');
        this._anim = this.getComponent(Animation);

        EventCenter.on(EventName.UI_CLICK_RECIPE_SLOT, this.node.name, (recipe: CraftRecipe) => this.handleClickRecipeSlot(recipe));
    }

    start() {
        RECIPE_TABLE.forEach((recipe: CraftRecipe) => {
            const node = instantiate(this.recipeSlotPrefab);
            this.recipeListNode.addChild(node);
            node.getComponent(RecipeSlot).init(recipe);
        });
    }

    onDestroy() {
        EventCenter.idOff(this.node.name);
    }

    /**
     * 点击配方槽
     *
     * @param recipe 配方
     */
    private handleClickRecipeSlot(recipe: CraftRecipe) {
        this._currentRecipe = recipe;
        this._recipeInfo.show(recipe);
        this._craftButton.active = true;
    }

    /**
     * 切换显示
     *
     * 按钮触发
     */
    toggle() {
        this._show = !this._show;
        this._anim.play(this._show ? 'Enter' : 'Exit');
        if (!this._show) {
            this._currentRecipe = null;
            this._recipeInfo.hide();
            this._craftButton.active = false;
        }
    }

    /**
     * 点击制作按钮
     *
     * 按钮触发
     */
    clickCraftButton() {
        if (!this._currentRecipe ||
            !RecipeUtil.checkRequirements(this._currentRecipe) ||
            !RecipeUtil.checkProduct(this._currentRecipe)) {
            // 未选中配方，或材料不足，或无法继续制作更多的
            return;
        }

        RecipeUtil.craft(this._currentRecipe);
    }
}