import { _decorator, Color, Component, Label, Sprite, SpriteFrame } from 'cc';
import { RecipeRequirement } from "db://assets/Script/Recipe/RecipeRequirement";
import { ITEM_RARITY_COLOR_MAP } from "db://assets/Script/Item/Item";
import { ResourceManager, ResourceType } from "db://assets/Script/ResourceManager";
import { Storehouse } from "db://assets/Script/Storehouse/Storehouse";

const { ccclass } = _decorator;

/**
 * 配方需求UI
 */
@ccclass('RecipeRequirementUI')
export class RecipeRequirementUI extends Component {
    /**
     * 背景
     */
    private _backgroundSprite: Sprite;

    /**
     * 物品图标
     */
    private _iconSprite: Sprite;

    /**
     * 物品名称标签
     */
    private _nameLabel: Label;

    /**
     * 数量标签
     */
    private _countLabel: Label;

    /**
     * 需求
     */
    private _requirement: RecipeRequirement;

    onLoad() {
        this._backgroundSprite = this.node.getChildByName('Background').getComponent(Sprite);
        this._iconSprite = this.node.getChildByName('Icon').getComponent(Sprite);
        this._nameLabel = this.node.getChildByName('Name').getComponent(Label);
        this._countLabel = this.node.getChildByName('Count').getComponent(Label);
    }

    /**
     * 初始化
     *
     * @param requirement 需求
     */
    init(requirement: RecipeRequirement) {
        this._requirement = requirement;

        // 背景颜色
        const color = ITEM_RARITY_COLOR_MAP.get(this._requirement.item.rarity);
        this._backgroundSprite.color = new Color(color.r, color.g, color.b, 51);
        ResourceManager.loadAsset(ResourceType.SPRITE_FRAME, this._requirement.item.icon,
            (spriteFrame: SpriteFrame) => this._iconSprite.spriteFrame = spriteFrame);

        // 名称标签
        this._nameLabel.string = this._requirement.item.displayName;

        // 数量标签
        this.updateCountLabel(Storehouse.countOne(this._requirement.item));
    }

    /**
     * 更新数量标签
     *
     * @param storeCount 持有数量
     */
    updateCountLabel(storeCount: number) {
        this._countLabel.string = `${storeCount} / ${this._requirement.count}`;
        this._countLabel.color = storeCount >= this._requirement.count ? Color.WHITE : Color.RED;
    }
}
