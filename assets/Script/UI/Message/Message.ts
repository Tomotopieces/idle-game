import { _decorator, Animation, Component, Label, UITransform } from 'cc';

const { ccclass, property, executeInEditMode } = _decorator;

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
@ccclass('Message')
@executeInEditMode(true)
export class Message extends Component {
    /**
     * 消息文本组件
     */
    private _label: Label;

    /**
     * 消息组件 Transform
     */
    private _labelTransform: UITransform;

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
        const labelNode = this.node.getChildByName('Label');
        this._label = labelNode.getComponent(Label);
        this._labelTransform = labelNode.getComponent(UITransform);
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

    @property({ type: String, tooltip: '消息内容' })
    get message(): string {
        return this._label.string;
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
        this._label.string = message;
        this.scheduleOnce(() => {
            this._transform.width = this._labelTransform.width + this._horizontalPadding * 2;
            this._transform.height = this._labelTransform.height + this._verticalPadding * 2;
        });
    }

    set horizontalPadding(value: number) {
        this._horizontalPadding = Math.max(value, 0);
    }

    set verticalPadding(value: number) {
        this._verticalPadding = Math.max(value, 0);
    }

    set dwellTime(value: number) {
        this._dwellTime = Math.max(value, 0);
    }
}


