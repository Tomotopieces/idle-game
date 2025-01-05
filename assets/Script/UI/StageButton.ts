import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
import { UpdateLevelEvent } from "db://assets/Script/Event/UpdateLevelEvent";
import { EventCenter } from "db://assets/Script/Event/EventCenter";

import { STAGE_TABLE } from "db://assets/Script/DataTable";
import { EventName } from "db://assets/Script/Event/EventName";

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
     * 点击
     *
     * 按钮触发
     */
    click() {
        const stage = STAGE_TABLE.get(this.stageName);
        EventCenter.emit(EventName.UPDATE_LEVEL, new UpdateLevelEvent(null, null, stage));
    }

    /**
     * 设置为当前Stage
     */
    setCurrent() {
        this.getComponent(Sprite).spriteFrame = this.greenRound;
    }
}


