import { _decorator, Component, director, JsonAsset, ProgressBar, resources } from 'cc';
import { SceneName } from "db://assets/Script/Util/Constant";
import { EnemyInfoJson } from "db://assets/Script/Entity/Enemy/EnemyInfoJson";
import { StageJson } from "db://assets/Script/Level/StageJson";
import { AreaJson } from "db://assets/Script/Level/AreaJson";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import {
    AREA_TABLE,
    CHAPTER_TABLE,
    CHAPTERS,
    CRAFT_RECIPE_TABLE,
    DataPath,
    ENEMY_TABLE,
    ITEM_META_TABLE,
    SET_BONUS_TABLE,
    SHOP_TABLE,
    STAGE_TABLE,
    UPGRADE_RECIPE_LIST
} from "db://assets/Script/DataTable";
import { ChapterJson } from "db://assets/Script/Level/ChapterJson";
import { AnyFunction } from "db://assets/Script/Util/Functions";
import { CraftRecipeJson } from "db://assets/Script/Recipe/CraftRecipeJson";
import { UpgradeRecipeJson } from "db://assets/Script/Recipe/UpgradeRecipeJson";
import { ShopJson } from "db://assets/Script/Shop/ShopJson";
import { ItemMetaJson } from "db://assets/Script/Item/ItemMetaJson";
import { SellableMetaJson } from "db://assets/Script/Sellable/SellableMetaJson";
import { EquipmentMetaJson } from "db://assets/Script/Equipment/EquipmentMetaJson";
import { GourdMetaJson } from "db://assets/Script/Drink/Gourd/GourdMetaJson";
import { LiquorMetaJson } from "db://assets/Script/Drink/Liquor/LiquorMetaJson";
import { InfusedIngredientMetaJson } from "db://assets/Script/Drink/InfusedIngredient/InfusedIngredientMetaJson";
import { ItemFactory } from "db://assets/Script/Item/ItemFactory";

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
        () => this.loadItemMetaTable(),
        () => this.loadSellableMetaTable(),
        () => this.loadEquipmentMetaTable(),
        () => this.loadGourdMetaTable(),
        () => this.loadLiquorMetaTable(),
        () => this.loadInfusedIngredientMetaTable(),
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
        ItemFactory.init();

        // 加载配置文件
        this.loadStep = 0;
    }

    start() {
        this.loadingBar.progress = 0;
    }

    /**
     * 加载道具元数据
     */
    private loadItemMetaTable() {
        resources.load(DataPath.ITEMS, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const jsons = data.json! as ItemMetaJson[];
            jsons.forEach((json, index) => ITEM_META_TABLE.set(json.name, ItemMetaJson.toItemMeta(index, json)));
            this.loadStep++;
        });
    }

    /**
     * 加载贩卖品元数据
     */
    private loadSellableMetaTable() {
        resources.load(DataPath.SELLABLES, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const jsons = data.json! as SellableMetaJson[];
            const idOffset = ITEM_META_TABLE.size;
            jsons.forEach((json, index) =>
                ITEM_META_TABLE.set(json.name, SellableMetaJson.toSellableMeta(idOffset + index, json)));
            this.loadStep++;
        });
    }

    /**
     * 加载装备元数据
     */
    private loadEquipmentMetaTable() {
        resources.load(DataPath.EQUIPMENTS, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const jsons = data.json! as EquipmentMetaJson[];
            const idOffset = ITEM_META_TABLE.size;
            jsons.forEach((json, index) => {
                const meta = EquipmentMetaJson.toEquipmentMeta(index + idOffset, json);
                ITEM_META_TABLE.set(json.name, meta); // 存入道具表
                if (meta.attributes.setName) {
                    // 登记套装装备
                    SET_BONUS_TABLE.get(meta.attributes.setName).record(meta.name);
                }
            });
            this.loadStep++;
        });
    }

    /**
     * 加载葫芦元数据
     */
    private loadGourdMetaTable() {
        resources.load(DataPath.GOURDS, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const jsons = data.json! as GourdMetaJson[];
            const idOffset = ITEM_META_TABLE.size;
            jsons.forEach((json: GourdMetaJson, index: number) =>
                ITEM_META_TABLE.set(json.name, GourdMetaJson.toGourdMeta(idOffset + index, json)));
            this.loadStep++;
        });
    }

    /**
     * 加载酒元数据
     */
    private loadLiquorMetaTable() {
        resources.load(DataPath.LIQUORS, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const jsons = data.json! as LiquorMetaJson[];
            const idOffset = ITEM_META_TABLE.size;
            jsons.forEach((json: LiquorMetaJson, index: number) =>
                ITEM_META_TABLE.set(json.name, LiquorMetaJson.toLiquorMeta(idOffset + index, json)));
            this.loadStep++;
        });
    }

    /**
     * 加载泡酒物元数据
     */
    private loadInfusedIngredientMetaTable() {
        resources.load(DataPath.INFUSED_INGREDIENTS, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const jsons = data.json! as InfusedIngredientMetaJson[];
            const idOffset = ITEM_META_TABLE.size;
            jsons.forEach((json: InfusedIngredientMetaJson, index: number) =>
                ITEM_META_TABLE.set(json.name, InfusedIngredientMetaJson.toInfusedIngredientMeta(idOffset + index, json)));
            this.loadStep++;
        })
    }

    /**
     * 加载铸造配方表
     */
    private loadCraftRecipeTable() {
        resources.load(DataPath.CRAFT_RECIPES, JsonAsset, (err: any, data: JsonAsset) => {
            err && console.error(err);
            const jsons = data.json! as CraftRecipeJson[];
            jsons.forEach((json: CraftRecipeJson, index: number) =>
                CRAFT_RECIPE_TABLE.set(json.outputName, CraftRecipeJson.toCraftRecipe(index, json)));
            this.loadStep++;
        })
    }

    /**
     * 加载升阶配方表
     */
    private loadUpgradeRecipeTable() {
        resources.load(DataPath.UPGRADE_RECIPES, JsonAsset, (err: any, data: JsonAsset) => {
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
        resources.load(DataPath.ENEMY_TABLES, JsonAsset, (err: any, data: JsonAsset) => {
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
        resources.load(DataPath.STAGE_TABLES, JsonAsset, (err: any, data: JsonAsset) => {
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
        resources.load(DataPath.AREA_TABLES, JsonAsset, (err: any, data: JsonAsset) => {
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
        resources.load(DataPath.CHAPTERS, JsonAsset, (err: any, data: JsonAsset) => {
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
        resources.load(DataPath.SHOPS, JsonAsset, (err: any, data: JsonAsset) => {
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
