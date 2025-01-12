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
@ccclass('MessageUI')
export class MessageUI extends Component {
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

    /**
     * 是否正在淡出
     */
    private _fadingOut: boolean = false;

    onLoad() {
        const richTextNode = this.node.getChildByName('RichText');
        this._richText = richTextNode.getComponent(RichText);
        this._richTextTransform = richTextNode.getComponent(UITransform);
        this._transform = this.node.getComponent(UITransform);
        this._anim = this.node.getComponent(Animation);
    }

    start() {
        this._anim.play('FadeIn');
        this.scheduleOnce(() => this.fadeOut(), this._dwellTime);
    }

    /**
     * 淡出
     */
    fadeOut() {
        if (this._fadingOut) {
            return;
        }
        this._fadingOut = true;
        this.unscheduleAllCallbacks(); // 若为 MessageCenter 中调用的情况，则可以取消 start 中设定的 fadeOut schedule
        this._anim.play('FadeOut');
        this.scheduleOnce(() => this.destroy(), 1);
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
