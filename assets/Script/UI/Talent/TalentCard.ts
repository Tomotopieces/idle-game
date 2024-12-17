import { _decorator, Component, Label, Layout, Node, UITransform, Vec3, view } from 'cc';
import { TalentTreeNode } from "db://assets/Script/Talent/TalentTreeNode";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Util/Constant";

const { ccclass, executeInEditMode } = _decorator;

/**
 * 天赋卡片
 */
@ccclass('TalentCard')
@executeInEditMode(true)
export class TalentCard extends Component {
    /**
     * 天赋树节点
     */
    private _talentTreeNode: TalentTreeNode;

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
     * 天赋名称 Label
     */
    private _nameLabel: Label;

    /**
     * 天赋等级节点
     */
    private _levelNode: Node;

    /**
     * 天赋等级 Label
     */
    private _levelLabel: Label;

    /**
     * 天赋描述 Label
     */
    private _descriptionLabel: Label;

    /**
     * 操作节点
     */
    private _operationNode: Node;

    onLoad() {
        this._infoLayout = this.node.getChildByName("InfoLayout");
        this._infoLayoutTransform = this._infoLayout.getComponent(UITransform);
        this._transform = this.node.getComponent(UITransform);
        this._backgroundTransform = this.node.getChildByName("Background").getComponent(UITransform);
        this._nameLabel = this._infoLayout.getChildByName("Name").getComponent(Label);
        this._levelNode = this._infoLayout.getChildByName("Level");
        this._levelLabel = this._levelNode.getComponent(Label);
        this._descriptionLabel = this._infoLayout.getChildByName("Description").getComponent(Label);
        this._operationNode = this._infoLayout.getChildByName("Operation");
    }

    update(_dt: number) {
        this._backgroundTransform.width = this._transform.width = this._infoLayoutTransform.width;
        this._backgroundTransform.height = this._transform.height = this._infoLayoutTransform.height;

        // 更新 Layout
        this._infoLayout.getComponent(Layout).updateLayout(true);
    }

    show(targetWorldPosition: Vec3, talentTreeNode: TalentTreeNode) {
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

        // 设置卡片内容
        this._nameLabel.string = talentTreeNode.talent.displayName;
        this._levelNode.active = !talentTreeNode.locked; // 只在解锁后显示等级
        this._levelLabel.string = `Lv.${talentTreeNode.talent.level}`;
        this._descriptionLabel.string = talentTreeNode.talent.description;
        this._operationNode.active = !talentTreeNode.locked && !talentTreeNode.maxActivated(); // 只在未锁定未到最大等级时显示操作按钮

        // 更新 Layout
        this._infoLayout.getComponent(Layout).updateLayout(true);
    }

    clickCard() {
        this.hide();
    }

    clickbutton() {
        EventCenter.emit(EventName.TALENT_UPGRADE, this._talentTreeNode);

        if (this._talentTreeNode.maxActivated()) {
            this._operationNode.active = false;
            this._infoLayout.getComponent(Layout).updateLayout(true);
        }

        EventCenter.emit(EventName.UI_UPDATE_TALENT_SLOT, this._talentTreeNode);
    }

    /**
     * 隐藏
     */
    hide() {
        this.node.active = false;
    }
}


