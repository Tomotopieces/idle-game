import { Chapter } from "db://assets/Script/Level/Chapter";
import { AREA_TABLE } from "db://assets/Script/DataTable";

/**
 * 关卡章节JSON
 */
export class ChapterJson {
    /**
     * 名称
     */
    readonly name: string;

    /**
     * 显示名称
     */
    readonly displayName: string;

    /**
     * 区域名称列表
     */
    readonly areas: Array<string>;

    /**
     * 转换为 Chapter
     *
     * @param id          ID
     * @param chapterJson ChapterJson
     */
    static toChapter(id: number, chapterJson: ChapterJson): Chapter {
        const areas = chapterJson.areas.map(areaName => AREA_TABLE.get(areaName));
        return new Chapter(id, chapterJson.name, chapterJson.displayName, areas);
    }
}