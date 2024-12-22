import { _decorator, Component, director, JsonAsset, ProgressBar, resources } from 'cc';
import { SceneName } from "db://assets/Script/Util/Constant";
import { Item } from "db://assets/Script/Item/Item";
import { EnemyInfoJson } from "db://assets/Script/Entity/Enemy/EnemyInfoJson";
import { StageJson } from "db://assets/Script/Level/StageJson";
import { AreaJson } from "db://assets/Script/Level/AreaJson";
import { Equipment } from "db://assets/Script/Item/Equipment/Equipment";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import {
    AREA_TABLE,
    CHAPTER_TABLE,
    DataPath,
    ENEMY_TABLE,
    ITEM_TABLE,
    SET_EFFECT_TABLE,
    STAGE_TABLE
} from "db://assets/Script/DataTable";
import { ChapterJson } from "db://assets/Script/Level/ChapterJson";

const { ccclass, property } = _decorator;

const STEPS = 6;

/**
 * 游戏加载器
 */
@ccclass('GameLoader')
export class GameLoader extends Component {
    /**
     * 加载进度条
     */
    @property({ type: ProgressBar, tooltip: '加载进度条' })
    loadingBar: ProgressBar = null;

    onLoad() {
        EventCenter.init();

        // 加载配置文件
        this.loadItemTable();
    }

    start() {
        this.loadingBar.progress = 0;
    }

    /**
     * 加载道具表
     */
    private loadItemTable() {
        resources.load(DataPath.ITEM_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const rawItemList = data.json! as Array<Item>;
            rawItemList.forEach((rawItem: Item, index: number) =>
                ITEM_TABLE.set(rawItem.name, Item.fromObject(index, rawItem)));

            this.loadingBar.progress += 1 / STEPS;

            this.loadEquipmentTable();
        });
    }

    /**
     * 加载装备表
     */
    private loadEquipmentTable() {
        resources.load(DataPath.EQUIPMENT_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const rawItemList = data.json! as Array<Equipment>;
            const indexOffset = ITEM_TABLE.size;
            rawItemList.forEach((rawItem: Equipment, index: number) => {
                const equipment = Equipment.fromObject(index + indexOffset, rawItem);
                ITEM_TABLE.set(rawItem.name, equipment); // 存入道具表
                if (equipment.attributes.setName) {
                    // 登记套装装备
                    SET_EFFECT_TABLE.get(equipment.attributes.setName).record(equipment.name);
                }
            });

            this.loadingBar.progress += 1 / STEPS;

            this.loadEnemyTable();
        });
    }

    /**
     * 加载敌人表
     */
    private loadEnemyTable() {
        resources.load(DataPath.ENEMY_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const rawInfoList = data.json! as Array<EnemyInfoJson>;
            rawInfoList.forEach((rawInfo: EnemyInfoJson, index: number) =>
                ENEMY_TABLE.set(rawInfo.name, EnemyInfoJson.toEnemyInfo(index, rawInfo)));

            this.loadingBar.progress += 1 / STEPS;

            this.loadStageTable();
        });
    }

    /**
     * 加载舞台表
     */
    private loadStageTable() {
        resources.load(DataPath.STAGE_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const rawStageList = data.json! as Array<StageJson>;
            rawStageList.forEach((rawStage: StageJson, index: number) =>
                STAGE_TABLE.set(rawStage.name, StageJson.toStage(index, rawStage)));

            this.loadingBar.progress += 1 / STEPS;

            this.loadAreaTable();
        })
    }

    /**
     * 加载区域表
     */
    private loadAreaTable() {
        resources.load(DataPath.AREA_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const rawAreaList = data.json! as Array<AreaJson>;
            rawAreaList.forEach((rawArea: AreaJson, index: number) =>
                AREA_TABLE.set(rawArea.name, AreaJson.toArea(index, rawArea)));

            this.loadingBar.progress += 1 / STEPS;

            this.loadChapterTable();
        })
    }

    /**
     * 加载章节表
     */
    private loadChapterTable() {
        resources.load(DataPath.CHAPTER_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const rawChapterList = data.json! as Array<ChapterJson>;
            rawChapterList.forEach((rawChapter: ChapterJson, index: number) =>
                CHAPTER_TABLE.set(rawChapter.name, ChapterJson.toChapter(index, rawChapter)));

            this.loadingBar.progress += 1 / STEPS;

            this.onLoadFinished();
        })
    }

    /**
     * 加载完成
     */
    private onLoadFinished() {
        director.loadScene(SceneName.GAME);
    }
}


