import { Area } from "db://assets/Script/Level/Area";
import { Stage } from "db://assets/Script/Level/Stage";
import { AREA_TABLE, CHAPTER_TABLE, STAGE_TABLE } from "db://assets/Script/DataTable";
import { Chapter } from "db://assets/Script/Level/Chapter";

/**
 * 默认关卡名称
 */
export enum DefaultLevelName {
    /**
     * 章节（黑风山）
     */
    CHAPTER = 'hei_feng_shan',

    /**
     * 区域（苍狼林）
     */
    AREA = 'cang_lang_lin',

    /**
     * 舞台（桃儿坡）
     */
    STAGE = 'tao_er_po',
}

/**
 * 关卡
 */
export class Level {
    static CHAPTER: Chapter;
    static AREA: Area;
    static STAGE: Stage;

    /**
     * 获取章节的第一个区域
     *
     * @param chapter 章节
     * @return 区域
     */
    static firstAreaOf(chapter: Chapter): Area {
        return AREA_TABLE.get(chapter.areas[0].name);
    }

    /**
     * 获取章节的最后一个区域
     *
     * @param chapter 章节
     * @reutnr 区域
     */
    static lastAreaOf(chapter: Chapter): Area {
        return AREA_TABLE.get(chapter.areas[chapter.areas.length - 1].name);
    }

    /**
     * 获取上一个章节
     *
     * @param currentChapter 当前章节
     * @return 上一章节
     */
    static previousChapterOf(currentChapter: Chapter): Chapter {
        const chapters = Array.from(CHAPTER_TABLE.values()).sort((a, b) => a.id - b.id);
        const currentIndex = chapters.findIndex(chapter => chapter.name === currentChapter.name);
        return chapters[Math.max(currentIndex - 1, 0)];
    }

    /**
     * 获取下一个章节
     *
     * @param currentChapter 当前章节
     * @return 下一章节
     */
    static nextChapterOf(currentChapter: Chapter): Chapter {
        const chapters = Array.from(CHAPTER_TABLE.values()).sort((a, b) => a.id - b.id);
        const currentIndex = chapters.findIndex(chapter => chapter.name === currentChapter.name);
        return chapters[Math.min(currentIndex + 1, chapters.length - 1)];
    }

    /**
     * 获取区域的第一个舞台
     *
     * @param area 区域
     * @return 舞台
     */
    static firstStageOf(area: Area): Stage {
        return STAGE_TABLE.get(area.stages[0].name);
    }

    /**
     * 获取区域的最后一个舞台
     *
     * @param area 区域
     */
    static lastStageOf(area: Area): Stage {
        return STAGE_TABLE.get(area.stages[area.stages.length - 1].name);
    }

    /**
     * 获取上一个区域
     *
     * @param currentArea 当前区域
     * @reutnr 上一区域
     */
    static previousAreaOf(currentArea: Area): Area {
        const areas = Array.from(AREA_TABLE.values()).sort((a, b) => a.id - b.id);
        const currentIndex = areas.findIndex(area => area.name === currentArea.name);
        return areas[Math.max(currentIndex - 1, 0)];
    }

    /**
     * 获取下一个区域
     *
     * @param currentArea 当前区域
     * @return 下一区域
     */
    static nextAreaOf(currentArea: Area): Area {
        const areas = Array.from(AREA_TABLE.values()).sort((a, b) => a.id - b.id);
        const currentIndex = areas.findIndex(area => area.name === currentArea.name);
        return areas[Math.min(currentIndex + 1, areas.length - 1)];
    }
}
