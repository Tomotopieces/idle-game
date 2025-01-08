import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { TalentTreeNode } from "db://assets/Script/Talent/TalentTreeNode";
import { TALENT_TREE } from "db://assets/Script/DataTable";
import { EventCenter } from "db://assets/Script/Event/EventCenter";

import { EventName } from "db://assets/Script/Event/EventName";

const { ccclass, property, executeInEditMode } = _decorator;

/**
 * 天赋槽UI
 */
@ccclass('TalentSlot')
@executeInEditMode(true)
export class TalentSlot extends Component {
    /**
     * 天赋名
     */
    @property
    private _talentName: string = '';

    /**
     * 底部图片-锁定时
     */
    @property({ type: SpriteFrame, displayName: '底部图片-锁定时' })
    lockedBottom: SpriteFrame;

    /**
     * 底部图片-解锁时
     */
    @property({ type: SpriteFrame, displayName: '底部图片-解锁时' })
    unlockedBottom: SpriteFrame;

    /**
     * 底部图片-激活时
     */
    @property({ type: SpriteFrame, displayName: '底部图片-激活时' })
    activatedBottom: SpriteFrame;

    /**
     * 底部图片-激活至最大等级时
     */
    @property({ type: SpriteFrame, displayName: '底部图片-激活至最大等级时' })
    maxActivatedBottom: SpriteFrame;

    /**
     * 底部图片
     */
    private _bottomSprite: Sprite;

    /**
     * 天赋名标签
     */
    private _nameLabel: Label;

    /**
     * 锁定遮罩
     */
    private _lockMask: Node;

    /**
     * 天赋树节点
     */
    private _talentTreeNode: TalentTreeNode;

    onLoad() {
        this._bottomSprite = this.node.getComponent(Sprite);
        this._nameLabel = this.node.getChildByName('Name').getComponent(Label);
        this._lockMask = this.node.getChildByName('LockMask');
        this.talentName = this._talentName;

        this.updateBottomSprite();
    }

    /**
     * 更新底部图片
     */
    updateBottomSprite() {
        if (!this._talentTreeNode) {
            this._bottomSprite.spriteFrame = this.lockedBottom;
            return;
        }

        this._lockMask.active = false;
        if (this._talentTreeNode.locked) {
            this._bottomSprite.spriteFrame = this.lockedBottom;
            this._lockMask.active = true;
        } else if (!this._talentTreeNode.activated()) {
            this._bottomSprite.spriteFrame = this.unlockedBottom;
        } else if (!this._talentTreeNode.maxActivated()) {
            this._bottomSprite.spriteFrame = this.activatedBottom;
        } else {
            this._bottomSprite.spriteFrame = this.maxActivatedBottom;
        }
    }

    /**
     * 点击展示信息卡片
     *
     * 按钮触发
     */
    click() {
        EventCenter.emit(EventName.UI_CLICK_TALENT_SLOT, this);
    }

    @property({ type: String, displayName: '天赋名', tooltip: '拼音小写+下划线分词' })
    get talentName(): string {
        return this._talentName;
    }

    set talentName(value: string) {
        if (!value) {
            this._talentTreeNode = null;
            this._nameLabel.string = '天赋名称';
        }

        this._talentName = value;
        this._talentTreeNode = TALENT_TREE.get(this._talentName);
        if (!this._talentTreeNode) {
            return;
        }
        this._nameLabel.string = this._talentTreeNode.talent.displayName;
        this.updateBottomSprite();
    }

    get talentTreeNode(): TalentTreeNode {
        return this._talentTreeNode;
    }
}
