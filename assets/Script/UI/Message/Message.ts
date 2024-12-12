import { _decorator, CCInteger, Component, UITransform } from 'cc';

const { ccclass, property, executeInEditMode } = _decorator;

/**
 * 弹出消息
 */
@ccclass('Message')
@executeInEditMode(true)
export class Message extends Component {
    /**
     * 水平 Padding
     */
    @property
    private _horizontalPadding: number = 40;

    /**
     * 垂直 Padding
     */
    @property
    private _verticalPadding: number = 20;

    /**
     * 消息文本 Transform
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

    onLoad() {
        this._backgroundTransform = this.node.getChildByName('Background').getComponent(UITransform);
        this._labelTransform = this.node.getChildByName('Label').getComponent(UITransform);
        this._transform = this.node.getComponent(UITransform);
    }

    update(_dt: number) {
        this._backgroundTransform.width =
            this._transform.width =
                this._labelTransform.width + this._horizontalPadding * 2;
        this._backgroundTransform.height =
            this._transform.height =
                this._labelTransform.height + this._verticalPadding * 2;
    }

    @property({ type: CCInteger, tooltip: '水平 Padding' })
    get horizontalPadding(): number {
        return this._horizontalPadding;
    }

    set horizontalPadding(value: number) {
        this._horizontalPadding = value;
    }

    @property({ type: CCInteger, tooltip: '垂直 Padding' })
    get verticalPadding(): number {
        return this._verticalPadding;
    }

    set verticalPadding(value: number) {
        this._verticalPadding = value;
    }
}


