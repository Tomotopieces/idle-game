import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
import { ResourceManager, ResourceType } from "db://assets/Script/ResourceManager";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { Recipe } from "db://assets/Script/Recipe/Recipe";

const { ccclass } = _decorator;

/**
 * 配方UI
 */
@ccclass('RecipeSlot')
export class RecipeSlot extends Component {
    /**
     * 产物图标
     */
    private _outputIcon: Sprite;

    /**
     * 配方
     */
    private _recipe: Recipe;

    onLoad() {
        this._outputIcon = this.node.getChildByName('OutputIcon').getComponent(Sprite);
    }

    /**
     * 初始化
     *
     * @param recipe 配方
     */
    init(recipe: Recipe) {
        this._recipe = recipe;
        ResourceManager.loadAsset(ResourceType.SPRITE_FRAME, recipe.output.icon, (spriteFrame: SpriteFrame) => {
            this._outputIcon.spriteFrame = spriteFrame;
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

    get recipe(): Recipe {
        return this._recipe;
    }
}