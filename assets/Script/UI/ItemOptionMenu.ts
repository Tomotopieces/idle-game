import { _decorator, Component, Sprite, SpriteFrame, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 物品选项菜单
 */
@ccclass('ItemOptionMenu')
export class ItemOptionMenu extends Component {
    /**
     * 确认贴图
     */
    @property({ type: SpriteFrame, tooltip: '确认贴图' })
    confirmImage: SpriteFrame;

    /**
     * 取消贴图
     */
    @property({ type: SpriteFrame, tooltip: '取消贴图' })
    cancelImage: SpriteFrame;

    /**
     * 贴图
     */
    @property({ type: Sprite, tooltip: '贴图' })
    sprite: Sprite;

    /**
     * 点击
     */
    private _onClick: Function;

    /**
     * 显示
     *
     * @param targetWorldPosition 目标世界坐标
     * @param imageType 贴图类型
     * @param onClick 点击事件
     */
    showUp(targetWorldPosition: Vec3, imageType: boolean, onClick: Function) {
        this.node.active = true;
        this.node.setWorldPosition(targetWorldPosition);
        this.sprite.spriteFrame = imageType ? this.confirmImage : this.cancelImage;
        this._onClick = onClick;
    }

    /**
     * 隐藏
     */
    hide() {
        this.node.active = false;
    }

    /**
     * 点击
     *
     * 按钮触发
     */
    click() {
        if (this._onClick) {
            this._onClick();
        }
    }
}


