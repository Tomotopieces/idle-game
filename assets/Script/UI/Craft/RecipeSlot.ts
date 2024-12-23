import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
import { CraftRecipe } from "db://assets/Script/Recipe/CraftRecipe";
import { ResourceManager, ResourceType } from "db://assets/Script/ResourceManager";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";

const { ccclass } = _decorator;

/**
 * 配方UI
 */
@ccclass('RecipeSlot')
export class RecipeSlot extends Component {
    /**
     * 产物图标
     */
    private _productIcon: Sprite;

    /**
     * 配方
     */
    private _recipe: CraftRecipe;

    onLoad() {
        this._productIcon = this.node.getChildByName('ProductIcon').getComponent(Sprite);
    }

    /**
     * 初始化
     *
     * @param recipe 配方
     */
    init(recipe: CraftRecipe) {
        this._recipe = recipe;
        ResourceManager.loadAsset(ResourceType.SPRITE_FRAME, recipe.product.icon, (spriteFrame: SpriteFrame) => {
            this._productIcon.spriteFrame = spriteFrame;
        });
    }

    /**
     * 点击
     *
     * 按钮触发
     */
    click() {
        EventCenter.emit(EventName.UI_CLICK_RECIPE_SLOT, this._recipe);
    }
}