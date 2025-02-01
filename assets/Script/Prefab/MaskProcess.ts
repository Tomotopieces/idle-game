import { _decorator, CCBoolean, CCFloat, Component, Sprite, SpriteFrame, UITransform } from "cc";

const { ccclass, property, executeInEditMode } = _decorator;

/**
 * 遮罩进度条
 */
@ccclass('MaskProcess')
@executeInEditMode(true)
export class MaskProcess extends Component {
    /**
     * Transform
     */
    private _transform: UITransform;

    /**
     * 图片
     */
    private _sprite: Sprite;

    /**
     * 反转填充
     */
    @property()
    private _invert: boolean = false;

    /**
     * 白色填充图片
     */
    @property({ type: SpriteFrame, displayName: '白色填充图片' })
    whiteColorImage: SpriteFrame;

    /**
     * 黑色填充图片
     */
    @property({ type: SpriteFrame, displayName: '黑色填充图片' })
    blackColorImage: SpriteFrame;

    /**
     * 宽度
     */
    @property
    private _width: number;

    /**
     * 最大高度
     */
    @property
    private _maxHeight: number;

    /**
     * 默认进度
     */
    @property
    private _process: number = 0.5;

    onLoad() {
        this._transform = this.getComponent(UITransform);
        this._sprite = this.getComponent(Sprite);

        this._transform.width = this._width;
        this.invert = this._invert;
        this.width = this._width;
        this.maxHeight = this._maxHeight;
    }

    @property({ type: CCBoolean, displayName: '反转填充' })
    get invert(): boolean {
        return this._invert;
    }

    set invert(value: boolean) {
        this._invert = value;
        this._sprite.spriteFrame = this._invert ? this.whiteColorImage : this.blackColorImage;
        this.process = this._process;
    }

    @property({ type: CCFloat, displayName: '宽度' })
    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
        this._transform.width = value;
    }

    @property({ type: CCFloat, displayName: '最大高度' })
    get maxHeight(): number {
        return this._maxHeight;
    }

    set maxHeight(value: number) {
        this._maxHeight = value;
        this.process = this._process;
    }

    @property({ type: CCFloat, min: 0, max: 1, step: 0.1, slide: true, displayName: '进度' })
    get process(): number {
        return this._process;
    }

    set process(value: number) {
        this._process = value;
        this._transform.height = (this._invert ? value : 1 - value) * this._maxHeight;
    }
}