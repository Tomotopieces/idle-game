import { EventArgument } from "db://assets/Script/Event/EventArgument";
import { Chapter } from "db://assets/Script/Level/Chapter";
import { Area } from "db://assets/Script/Level/Area";
import { Stage } from "db://assets/Script/Level/Stage";
import { Level } from "db://assets/Script/Level/Level";

/**
 * 游戏关卡更新（后）事件
 */
export class GameLevelUpdatedEvent extends EventArgument {
    /**
     * 章节
     */
    chapter: Chapter;

    /**
     * 区域
     */
    area: Area;

    /**
     * 舞台
     */
    stage: Stage;

    constructor() {
        super();
        this.chapter = Level.CHAPTER;
        this.area = Level.AREA;
        this.stage = Level.STAGE;
    }
}