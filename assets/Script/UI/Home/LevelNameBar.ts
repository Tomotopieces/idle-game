import { _decorator, Component, Label } from 'cc';
import { Stage } from "db://assets/Script/Level/Stage";
import { Area } from "db://assets/Script/Level/Area";
import { Chapter } from "db://assets/Script/Level/Chapter";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { GameLevelUpdatedEvent } from "db://assets/Script/Event/Events/GameLevelUpdatedEvent";

const { ccclass, property } = _decorator;

/**
 * 关卡名称
 */
@ccclass('LevelNameBar')
export class LevelNameBar extends Component {
    /**
     * 关卡名称Label
     */
    @property({ type: Label, tooltip: '关卡名称Label' })
    label: Label;

    onLoad() {
        EventCenter.on(EventName.UI_UPDATE_GAME_LEVEL, this.node.name, (event: GameLevelUpdatedEvent) => this.handleGameLevelUpdated(event));
    }

    onDestroy() {
        EventCenter.idOff(this.node.name);
    }

    /**
     * 更新关卡名称
     *
     * @param chapter 章节
     * @param area    区域
     * @param stage   舞台
     */
    updateLevelName(chapter: Chapter, area: Area, stage: Stage) {
        this.label.string = `${chapter.displayName} - ${area.displayName} - ${stage.displayName}`;
    }

    /**
     * 处理关卡更新事件
     *
     * @param event 事件参数
     */
    private handleGameLevelUpdated(event: GameLevelUpdatedEvent) {
        this.label.string = `${event.chapter.displayName} - ${event.area.displayName} - ${event.stage.displayName}`;
    }
}
