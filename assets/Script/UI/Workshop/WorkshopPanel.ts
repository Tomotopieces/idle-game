import { _decorator, Animation, Component, instantiate, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { CraftRecipe } from "db://assets/Script/Recipe/CraftRecipe";
import { RecipeInfoUI } from "db://assets/Script/UI/Workshop/RecipeInfoUI";
import { RecipeSlot } from "db://assets/Script/UI/Workshop/RecipeSlot";
import { RecipeUtil } from "db://assets/Script/Util/RecipeUtil";
import { UpgradeRecipe } from "db://assets/Script/Recipe/UpgradeRecipe";
import { Recipe } from "db://assets/Script/Recipe/Recipe";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";
import { Equipment } from "db://assets/Script/Equipment/Equipment";

const { ccclass, property } = _decorator;

/**
 * 工坊模式
 */
enum WorkMode {
    /**
     * 铸造模式
     */
    CRAFT = 'Craft',

    /**
     * 升阶模式
     */
    UPGRADE = 'Upgrade',
}

/**
 * 工坊面板
 */
@ccclass('WorkshopPanel')
export class WorkshopPanel extends Component {
    /**
     * 配方槽预制体
     */
    @property({ type: Prefab, displayName: '配方槽预制体' })
    recipeSlotPrefab: Prefab;

    /**
     * 铸造按钮图片
     */
    @property({ type: SpriteFrame, displayName: '铸造按钮图片' })
    craftButtonImage: SpriteFrame;

    /**
     * 升阶按钮图片
     */
    @property({ type: SpriteFrame, displayName: '升阶按钮图片' })
    upgradeButtonImage: SpriteFrame;

    /**
     * 配方栏节点
     */
    private _recipeBarNode: Node;

    /**
     * 铸造模式按钮
     */
    private _craftModeButton: Node;

    /**
     * 升阶模式按钮
     */
    private _upgradeModeButton: Node;

    /**
     * 操作按钮图片
     */
    private _operationButtonImage: Sprite;

    /**
     * 配方信息
     */
    private _recipeInfo: RecipeInfoUI;

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
    private _currentRecipe: Recipe;

    /**
     * 工坊模式
     */
    private _workMode: WorkMode = WorkMode.CRAFT;

    onLoad() {
        this._recipeBarNode = this.node.getChildByName('RecipeScrollView').getChildByName('RecipeBar');
        this._craftModeButton = this.node.getChildByName('CraftModeButton');
        this._upgradeModeButton = this.node.getChildByName('UpgradeModeButton');
        this._operationButtonImage = this.node.getChildByName('OperationButton').getChildByName('Image').getComponent(Sprite);
        this._recipeInfo = this.node.getChildByName('RecipeInfo').getComponent(RecipeInfoUI);
        this._anim = this.getComponent(Animation);

        EventCenter.on(EventName.UI_CLICK_RECIPE_SLOT, this.node.name, (recipe: CraftRecipe) => this.handleClickRecipeSlot(recipe));
    }

    onDestroy() {
        EventCenter.idOff(this.node.name);
    }

    /**
     * 填充配方栏
     */
    private populateRecipeBar() {
        this._recipeBarNode.removeAllChildren();

        const recipes: Recipe[] = this._workMode === WorkMode.CRAFT ?
            RecipeUtil.availableCraftRecipes() :
            RecipeUtil.availableUpgradeRecipes();
        recipes.forEach(recipe => {
            const node = instantiate(this.recipeSlotPrefab);
            this._recipeBarNode.addChild(node);
            const recipeSlot = node.getComponent(RecipeSlot);
            recipeSlot.init(recipe);
        });
        this._currentRecipe = recipes[0];
        !!this._currentRecipe ? this._recipeInfo.show(this._currentRecipe) : this._recipeInfo.hide();
    }

    /**
     * 点击配方槽
     *
     * @param recipe 配方
     */
    private handleClickRecipeSlot(recipe: Recipe) {
        this._currentRecipe = recipe;
        this._recipeInfo.show(recipe);
    }

    /**
     * 铸造
     */
    private craft() {
        if (!RecipeUtil.satisfy(this._currentRecipe) ||
            !RecipeUtil.canProduce(this._currentRecipe)) {
            // 未选中配方，或材料不足，或无法继续制作更多的
            return;
        }

        if (RecipeUtil.craft(this._currentRecipe)) {
            this.populateRecipeBar();
        }
    }

    /**
     * 升阶
     */
    private upgrade() {
        if (!RecipeUtil.satisfy(this._currentRecipe)) {
            return;
        }

        if (RecipeUtil.upgrade(this._currentRecipe as UpgradeRecipe)) {
            const equipment = this._currentRecipe.output as Equipment;
            const equipments = PlayerController.PLAYER.equipments;
            if (equipments.equipmentSlotMap.get(equipment.equipmentType).stack?.item.name === equipment.name) {
                equipments.upgrade(equipment);
            }

            this.populateRecipeBar();
        }
    }

    /**
     * 点击操作按钮
     *
     * 按钮触发
     */
    clickOperationButton() {
        switch (this._workMode) {
            case WorkMode.CRAFT:
                this.craft();
                return;
            case WorkMode.UPGRADE:
                this.upgrade();
                return;
        }
    }

    /**
     * 切换模式
     *
     * 控制切换按钮的显示隐藏、替换操作按钮的图片
     *
     * 按钮触发
     */
    switchMode() {
        this._workMode = this._workMode === WorkMode.CRAFT ? WorkMode.UPGRADE : WorkMode.CRAFT;
        switch (this._workMode) {
            case WorkMode.CRAFT:
                this._craftModeButton.active = false;
                this._upgradeModeButton.active = true;
                this._operationButtonImage.spriteFrame = this.craftButtonImage;
                break;
            case WorkMode.UPGRADE:
                this._craftModeButton.active = true;
                this._upgradeModeButton.active = false;
                this._operationButtonImage.spriteFrame = this.upgradeButtonImage;
                break;
        }
        this.populateRecipeBar();
    }

    /**
     * 切换显示
     *
     * 按钮触发
     */
    toggle() {
        this._show = !this._show;
        this._anim.play(this._show ? 'Enter' : 'Exit');
        if (this._show) {
            this.populateRecipeBar();
        }
    }
}