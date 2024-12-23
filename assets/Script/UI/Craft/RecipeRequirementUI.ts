import { _decorator, Color, Component, Label, Sprite, SpriteFrame } from 'cc';
import { RecipeRequirement } from "db://assets/Script/Recipe/RecipeRequirement";
import { ITEM_QUALITY_COLOR_MAP } from "db://assets/Script/Item/Item";
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
    private _background: Sprite;

    /**
     * 物品图标
     */
    private _icon: Sprite;

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
        this._background = this.node.getChildByName('Background').getComponent(Sprite);
        this._icon = this.node.getChildByName('Icon').getComponent(Sprite);
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
        const color = ITEM_QUALITY_COLOR_MAP.get(requirement.item.quality);
        this._background.color = new Color(color.r, color.g, color.b, 51);
        ResourceManager.loadAsset(ResourceType.SPRITE_FRAME, requirement.item.icon,
            (spriteFrame: SpriteFrame) => this._icon.spriteFrame = spriteFrame);

        // 名称标签
        this._nameLabel.string = requirement.item.displayName;

        // 数量标签
        const count = Storehouse.countOne(requirement.item);
        this._countLabel.string = `${count} / ${requirement.count}`;
        this._countLabel.color = count >= requirement.count ? Color.WHITE : Color.RED;
    }

    /**
     * 更新数量
     */
    updateCount() {
        const count = Storehouse.countOne(this._requirement.item);
        this._countLabel.string = `${count} / ${this._requirement.count}`;
        this._countLabel.color = count >= this._requirement.count ? Color.WHITE : Color.RED;
    }
}
