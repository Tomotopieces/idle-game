import { _decorator, Component, director, JsonAsset, ProgressBar, resources } from 'cc';
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { DataPath, GlobalStateName, SceneName } from "db://assets/Script/Util/Constant";
import { Item } from "db://assets/Script/Item/Item";
import { EnemyInfoJson } from "db://assets/Script/Entity/Enemy/EnemyInfoJson";
import { EnemyInfo } from "db://assets/Script/Entity/Enemy/EnemyInfo";
import { StageJson } from "db://assets/Script/Level/StageJson";
import { Stage } from "db://assets/Script/Level/Stage";
import { AreaJson } from "db://assets/Script/Level/AreaJson";
import { Area } from "db://assets/Script/Level/Area";
import { Equipment } from "db://assets/Script/Item/Equipment/Equipment";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { SET_EFFECT_MAP } from "db://assets/Script/Item/Equipment/SetEffect/SetEffectMap";

const { ccclass, property } = _decorator;

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
            const rawItemList = data.json! as Array<Item>;
            const itemTable = new Map<string, Item>();
            rawItemList.forEach((rawItem: Item, index: number) =>
                itemTable.set(rawItem.name, Item.fromObject(index, rawItem)));
            GlobalState.setState(GlobalStateName.ITEM_TABLE, itemTable);

            this.loadingBar.progress += 0.2;

            this.loadEquipmentTable();
        });
    }

    /**
     * 加载装备表
     */
    private loadEquipmentTable() {
        resources.load(DataPath.EQUIPMENT_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            const rawItemList = data.json! as Array<Equipment>;
            const itemTable = GlobalState.getState(GlobalStateName.ITEM_TABLE) as Map<string, Item>;
            rawItemList.forEach((rawItem: Equipment, index: number) => {
                const equipment = Equipment.fromObject(index + itemTable.size, rawItem);
                itemTable.set(rawItem.name, equipment); // 存入道具表
                if (equipment.attributes.setName) {
                    // 登记套装装备
                    SET_EFFECT_MAP.get(equipment.attributes.setName).record(equipment.name);
                }
            });

            this.loadingBar.progress += 0.2;

            this.loadEnemyTable();
        });
    }

    /**
     * 加载敌人表
     */
    private loadEnemyTable() {
        resources.load(DataPath.ENEMY_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            const rawInfoList = data.json! as Array<EnemyInfoJson>;
            const infoTable = new Map<string, EnemyInfo>();
            rawInfoList.forEach((rawInfo: EnemyInfoJson, index: number) =>
                infoTable.set(rawInfo.name, EnemyInfoJson.toEnemyInfo(index, rawInfo)));
            GlobalState.setState(GlobalStateName.ENEMY_TABLE, infoTable);

            this.loadingBar.progress += 0.2;

            this.loadStageTable();
        });
    }

    /**
     * 加载舞台表
     */
    private loadStageTable() {
        resources.load(DataPath.STAGE_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            const rawStageList = data.json! as Array<StageJson>;
            const stageTable = new Map<string, Stage>();
            rawStageList.forEach((rawStage: StageJson, index: number) =>
                stageTable.set(rawStage.name, StageJson.toStage(index, rawStage)));
            GlobalState.setState(GlobalStateName.STAGE_TABLE, stageTable);

            this.loadingBar.progress += 0.2;

            this.loadAreaTable();
        })
    }

    /**
     * 加载区域表
     */
    private loadAreaTable() {
        resources.load(DataPath.AREA_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            const rawAreaList = data.json! as Array<AreaJson>;
            const areaTable = new Map<string, Area>();
            rawAreaList.forEach((rawArea: AreaJson, index: number) =>
                areaTable.set(rawArea.name, AreaJson.toArea(index, rawArea)));
            GlobalState.setState(GlobalStateName.AREA_TABLE, areaTable);

            this.loadingBar.progress += 0.2;

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


