import { _decorator, Component, Label, UITransform, Animation } from 'cc';

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
 * 消息状态
 */
enum MessageState {
    /**
     * 渐入
     */
    FADE_IN,

    /**
     * 停留
     */
    STAY,

    /**
     * 渐出
     */
    FADE_OUT,
}

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
     * 消息背景 Transform
     */
    private _backgroundTransform: UITransform;

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
     * 计时器
     */
    private _timer: number = 0;

    /**
     * 消息状态
     */
    private _state: MessageState;

    onLoad() {
        const labelNode = this.node.getChildByName('Label');
        this._label = labelNode.getComponent(Label);
        this._labelTransform = labelNode.getComponent(UITransform);
        this._backgroundTransform = this.node.getChildByName('Background').getComponent(UITransform);
        this._transform = this.node.getComponent(UITransform);
        this._anim = this.node.getComponent(Animation);
    }

    start() {
        this._anim.play('FadeIn');
        this._state = MessageState.FADE_IN;
    }

    update(dt: number) {
        switch (this._state) {
            case MessageState.FADE_IN:
                if (!this._anim.getState('FadeIn').isPlaying) {
                    this._state = MessageState.STAY;
                }
                break;
            case MessageState.STAY:
                this._timer += dt;
                if (this._timer >= this._dwellTime) {
                    this.fadeOut();
                }
                break;
            case MessageState.FADE_OUT:
                if (!this._anim.getState('FadeOut').isPlaying) {
                    this.node.destroy();
                }
                break;
        }

        this._backgroundTransform.width =
            this._transform.width =
                this._labelTransform.width + this._horizontalPadding * 2;
        this._backgroundTransform.height =
            this._transform.height =
                this._labelTransform.height + this._verticalPadding * 2;
    }

    @property({ type: String, tooltip: '消息内容' })
    get message(): string {
        return this._label.string;
    }

    fadeOut() {
        this._state = MessageState.FADE_OUT;
        this._anim.play('FadeOut');
    }

    /**
     * 设置消息内容并调整Node尺寸
     *
     * @param message 消息内容
     */
    set message(message: string) {
        this._label.string = message;
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


