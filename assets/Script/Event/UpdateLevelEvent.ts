import { Area } from "db://assets/Script/Level/Area";
import { Stage } from "db://assets/Script/Level/Stage";
import { EventArgument } from "db://assets/Script/Event/EventArgument";
import { Level } from "db://assets/Script/Level/Level";
import { Chapter } from "db://assets/Script/Level/Chapter";

/**
 * 更新关卡事件参数
 */
export class UpdateLevelEvent extends EventArgument {
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
     * @param chapter 章节, null则为当前章节
     * @param area    区域，null则为当前区域
     * @param stage   舞台，null则为当前舞台
     */
    constructor(chapter: Chapter, area: Area, stage: Stage) {
        super();
        console.log(`chapter: ${chapter?.name}, area: ${area?.name}, stage: ${stage?.name}`);
        console.log(`or chapter: ${Level.CHAPTER.name}, area: ${Level.AREA.name}, stage: ${Level.STAGE.name}`);
        this.chapter = chapter ?? Level.CHAPTER;
        this.area = area ?? Level.AREA;
        this.stage = stage ?? Level.STAGE;
    }
}
