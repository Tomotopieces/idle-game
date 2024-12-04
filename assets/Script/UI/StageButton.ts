import { _decorator, Component, EventTarget, Sprite, SpriteFrame } from 'cc';
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { UpdateLevelEvent } from "db://assets/Script/Event/UpdateLevelEvent";
import { Stage } from "db://assets/Script/Level/Stage";

const { ccclass, property } = _decorator;

/**
 * 舞台选择按钮
 */
@ccclass('StageButton')
export class StageButton extends Component {
    /**
     * 绿色圆形
     */
    @property({ type: SpriteFrame, tooltip: '绿色圆形' })
    greenRound: SpriteFrame;

    /**
     * 舞台名称
     */
    stageName: string = null;

    /**
     * 事件中心
     */
    private _eventTarget: EventTarget;

    start() {
        this._eventTarget = GlobalState.getState(GlobalStateName.EVENT_TARGET);
    }

    /**
     * 点击
     *
     * 按钮触发
     */
    click() {
        const stage = (GlobalState.getState(GlobalStateName.STAGE_TABLE) as Map<string, Stage>).get(this.stageName);
        this._eventTarget.emit(EventName.UPDATE_LEVEL, new UpdateLevelEvent(null, stage));
    }

    /**
     * 设置为当前Stage
     */
    setCurrent() {
        this.getComponent(Sprite).spriteFrame = this.greenRound;
    }
}


