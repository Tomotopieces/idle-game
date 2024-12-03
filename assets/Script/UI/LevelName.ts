import { _decorator, Component, EventTarget, Label } from 'cc';
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";
import { Stage } from "db://assets/Script/Level/Stage";
import { Area } from "db://assets/Script/Level/Area";

const { ccclass, property } = _decorator;

/**
 * 关卡名称
 */
@ccclass('LevelName')
export class LevelName extends Component {
    /**
     * 关卡名称Label
     */
    @property({ type: Label, tooltip: '关卡名称Label' })
    label: Label = null;

    /**
     * 自定义事件管理器
     */
    private _eventTarget: EventTarget;

    start() {
        this._eventTarget = GlobalState.getState(GlobalStateName.EVENT_TARGET);

        this._eventTarget.on(EventName.UPDATE_LEVEL, (area: Area, stage: Stage) => this.updateLevelName(area, stage));
    }

    /**
     * 更新关卡名称
     *
     * @param area 区域
     * @param stage 舞台
     */
    private updateLevelName(area: Area, stage: Stage) {
        this.label.string = `${area.displayName} - ${stage.displayName}`;
    }
}


