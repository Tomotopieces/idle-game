import { Area } from "db://assets/Script/Level/Area";
import { Stage } from "db://assets/Script/Level/Stage";
import { EventArgument } from "db://assets/Script/Event/EventArgument";
import { Level } from "db://assets/Script/Level/Level";
import { Chapter } from "db://assets/Script/Level/Chapter";

/**
 * 更新关卡事件参数
 */
export class UpdateGameLevelEvent extends EventArgument {
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

    /**
     * 构造函数
     *
     * @param stage 舞台，null则为当前舞台
     */
    constructor(stage: Stage) {
        super();
        this.stage = stage ?? Level.STAGE;
        this.area = Level.areaOf(this.stage);
        this.chapter = Level.chapterOf(this.area);
    }
}
