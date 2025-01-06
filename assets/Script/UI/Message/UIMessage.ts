import { _decorator, Animation, Component, RichText, UITransform } from 'cc';

const { ccclass } = _decorator;

/**
 * 默认水平 Padding 40px
 */
const DEFAULT_HORIZONTAL_PADDING = 40;

/**
 * 垂直 Padding 20px
 */
const DEFAULT_VERTICAL_PADDING = 20;

/**
 * 默认停留时间 5秒
 */
const DEFAULT_DWELL_TIME = 5;

/**
 * 弹出消息
 */
@ccclass('UIMessage')
export class UIMessage extends Component {
    /**
     * 富文本组件
     */
    private _richText: RichText;

    /**
     * 富文本组件 Transform
     */
    private _richTextTransform: UITransform;

    /**
     * 自身 Transform
     */
    private _transform: UITransform;

    /**
     * 动画机
     */
    private _anim: Animation;

    /**
     * 水平 Padding
     */
    private _horizontalPadding: number = DEFAULT_HORIZONTAL_PADDING;

    /**
     * 垂直 Padding
     */
    private _verticalPadding: number = DEFAULT_VERTICAL_PADDING;

    /**
     * 停留时间（秒）
     */
    private _dwellTime: number = DEFAULT_DWELL_TIME;

    onLoad() {
        const richTextNode = this.node.getChildByName('RichText');
        this._richText = richTextNode.getComponent(RichText);
        this._richTextTransform = richTextNode.getComponent(UITransform);
        this._transform = this.node.getComponent(UITransform);
        this._anim = this.node.getComponent(Animation);
    }

    start() {
        this._anim.play('FadeIn');
        this.node.once(Animation.EventType.FINISHED, () => {
            this.scheduleOnce(() => this.fadeOut(), this._dwellTime);
            this.node.once(Animation.EventType.FINISHED, () => this.node.destroy(), this);
        }, this);
    }

    onDestroy() {
        this.unscheduleAllCallbacks();
        this.node.targetOff(this);
    }

    /**
     * 消失动画
     */
    fadeOut() {
        if (!this.isValid) {
            return;
        }
        this._anim.play('FadeOut');
    }

    /**
     * 设置消息内容并调整Node尺寸
     *
     * @param message 消息内容
     */
    set message(message: string) {
        this._richText.string = message;
        this.scheduleOnce(() => {
            this._transform.width = this._richTextTransform.width + this._horizontalPadding * 2;
            this._transform.height = this._richTextTransform.height + this._verticalPadding * 2;
        });
    }
}


