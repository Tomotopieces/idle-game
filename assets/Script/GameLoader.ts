import { _decorator, Component, director, JsonAsset, ProgressBar, resources } from 'cc';
import { SceneName } from "db://assets/Script/Util/Constant";
import { Item } from "db://assets/Script/Item/Item";
import { EnemyInfoJson } from "db://assets/Script/Entity/Enemy/EnemyInfoJson";
import { StageJson } from "db://assets/Script/Level/StageJson";
import { AreaJson } from "db://assets/Script/Level/AreaJson";
import { Equipment } from "db://assets/Script/Equipment/Equipment";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import {
    AREA_TABLE,
    CHAPTER_TABLE,
    CHAPTERS,
    CRAFT_RECIPE_TABLE,
    DataPath,
    ENEMY_TABLE,
    ITEM_TABLE,
    SET_EFFECT_TABLE,
    SHOP_TABLE,
    STAGE_TABLE,
    UPGRADE_RECIPE_LIST
} from "db://assets/Script/DataTable";
import { ChapterJson } from "db://assets/Script/Level/ChapterJson";
import { AnyFunction } from "db://assets/Script/Util/Functions";
import { CraftRecipeJson } from "db://assets/Script/Recipe/CraftRecipeJson";
import { UpgradeRecipeJson } from "db://assets/Script/Recipe/UpgradeRecipeJson";
import { TradingItem } from "db://assets/Script/Trading/TradingItem";
import { ShopJson } from "db://assets/Script/Trading/ShopJson";

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

    /**
     * 加载步骤
     */
    private _loadStep = 0;

    /**
     * 加载函数
     */
    private readonly _loadProcess: AnyFunction[] = [
        () => this.loadItemTable(),
        () => this.loadTradingItemTable(),
        () => this.loadEquipmentTable(),
        () => this.loadCraftRecipeTable(),
        () => this.loadUpgradeRecipeTable(),
        () => this.loadEnemyTable(),
        () => this.loadStageTable(),
        () => this.loadAreaTable(),
        () => this.loadChapterTable(),
        () => this.loadShopTable(),
        () => this.onLoadFinished()
    ];

    onLoad() {
        EventCenter.init();

        // 加载配置文件
        this.loadStep = 0;
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
            const rawItems = data.json! as Item[];
            rawItems.forEach((rawItem: Item, index: number) =>
                ITEM_TABLE.set(rawItem.name, Item.fromObject(index, rawItem)));
            this.loadStep++;
        });
    }

    /**
     * 加载贩卖品表
     */
    private loadTradingItemTable() {
        resources.load(DataPath.TRADING_ITEM_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const rawItems = data.json! as TradingItem[];
            const indexOffset = ITEM_TABLE.size;
            rawItems.forEach((rawItem: TradingItem, index: number) =>
                ITEM_TABLE.set(rawItem.name, TradingItem.fromObject(index + indexOffset, rawItem)));
            this.loadStep++;
        });
    }

    /**
     * 加载装备表
     */
    private loadEquipmentTable() {
        resources.load(DataPath.EQUIPMENT_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const rawItems = data.json! as Equipment[];
            const indexOffset = ITEM_TABLE.size;
            rawItems.forEach((rawItem: Equipment, index: number) => {
                const equipment = Equipment.fromObject(index + indexOffset, rawItem);
                ITEM_TABLE.set(rawItem.name, equipment); // 存入道具表
                if (equipment.attributes.setName) {
                    // 登记套装装备
                    SET_EFFECT_TABLE.get(equipment.attributes.setName).record(equipment.name);
                }
            });
            this.loadStep++;
        });
    }

    /**
     * 加载铸造配方表
     */
    private loadCraftRecipeTable() {
        resources.load(DataPath.CRAFT_RECIPE_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const rawRecipes = data.json! as CraftRecipeJson[];
            rawRecipes.forEach((rawRecipe: CraftRecipeJson, index: number) =>
                CRAFT_RECIPE_TABLE.set(rawRecipe.productName, CraftRecipeJson.toCraftRecipe(index, rawRecipe)));
            this.loadStep++;
        })
    }

    /**
     * 加载升阶配方表
     */
    private loadUpgradeRecipeTable() {
        resources.load(DataPath.UPGRADE_RECIPE_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const rawRecipes = data.json! as UpgradeRecipeJson[];
            rawRecipes.forEach((rawRecipe: UpgradeRecipeJson, index: number) =>
                UPGRADE_RECIPE_LIST.push(UpgradeRecipeJson.toUpgradeRecipe(index, rawRecipe)));
            this.loadStep++;
        });
    }

    /**
     * 加载敌人表
     */
    private loadEnemyTable() {
        resources.load(DataPath.ENEMY_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const rawInfos = data.json! as EnemyInfoJson[];
            rawInfos.forEach((rawInfo: EnemyInfoJson, index: number) =>
                ENEMY_TABLE.set(rawInfo.name, EnemyInfoJson.toEnemyInfo(index, rawInfo)));
            this.loadStep++;
        });
    }

    /**
     * 加载舞台表
     */
    private loadStageTable() {
        resources.load(DataPath.STAGE_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const rawStageList = data.json! as StageJson[];
            rawStageList.forEach((rawStage: StageJson, index: number) =>
                STAGE_TABLE.set(rawStage.name, StageJson.toStage(index, rawStage)));
            this.loadStep++;
        });
    }

    /**
     * 加载区域表
     */
    private loadAreaTable() {
        resources.load(DataPath.AREA_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const rawAreas = data.json! as AreaJson[];
            rawAreas.forEach((rawArea: AreaJson, index: number) =>
                AREA_TABLE.set(rawArea.name, AreaJson.toArea(index, rawArea)));
            this.loadStep++;
        });
    }

    /**
     * 加载章节表
     */
    private loadChapterTable() {
        resources.load(DataPath.CHAPTER_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const rawChapters = data.json! as ChapterJson[];
            rawChapters.forEach((rawChapter: ChapterJson, index: number) => {
                const chapter = ChapterJson.toChapter(index, rawChapter);
                CHAPTER_TABLE.set(rawChapter.name, chapter);
                CHAPTERS.push(chapter);
            });
            this.loadStep++;
        });
    }

    /**
     * 加载商店表
     */
    private loadShopTable() {
        resources.load(DataPath.SHOP_TABLE, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const rawShops = data.json! as ShopJson[];
            rawShops.forEach((rawShop: ShopJson, index: number) =>
                SHOP_TABLE.set(rawShop.scene, ShopJson.toShop(index, rawShop)));
            this.loadStep++;
        });
    }

    /**
     * 加载完成
     */
    private onLoadFinished() {
        director.loadScene(SceneName.GAME);
    }

    private get loadStep(): number {
        return this._loadStep;
    }

    private set loadStep(value: number) {
        this._loadStep = value;
        this.loadingBar.progress = this._loadStep / this._loadProcess.length;
        this._loadProcess[this._loadStep]();
    }
}
