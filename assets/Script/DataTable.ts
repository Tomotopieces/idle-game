import { Area } from "db://assets/Script/Level/Area";
import { Stage } from "db://assets/Script/Level/Stage";
import { EnemyInfo } from "db://assets/Script/Entity/Enemy/EnemyInfo";
import { PassiveEffect } from "db://assets/Script/PassiveEffect/PassiveEffect";
import {
    UniqueUtilityLinGunShuangShe
} from "db://assets/Script/Equipment/UniqueUtility/UniqueUtilityLinGunShuangShe";
import { SetBonus } from "db://assets/Script/Equipment/SetBonus/SetBonus";
import { SetBonusEffectZiZhuBiJiao } from "db://assets/Script/Equipment/SetBonus/Effects/SetBonusEffectZiZhuBiJiao";
import { TalentTreeNode } from "db://assets/Script/Talent/TalentTreeNode";
import { TalentTiJian } from "db://assets/Script/Talent/Talents/TalentTiJian";
import { TalentShiPo } from "db://assets/Script/Talent/Talents/TalentShiPo";
import { Chapter } from "db://assets/Script/Level/Chapter";
import { CraftRecipe } from "db://assets/Script/Recipe/CraftRecipe";
import { UpgradeRecipe } from "db://assets/Script/Recipe/UpgradeRecipe";
import { Shop } from "db://assets/Script/Shop/Shop";
import { ItemMeta } from "db://assets/Script/Item/ItemMeta";
import { UniqueUtilityBaiLianZi } from "db://assets/Script/Equipment/UniqueUtility/UniqueUtilityBaiLianZi";
import { LiquorEffectSongLao } from "db://assets/Script/Drink/Liquor/Effects/LiquorEffectSongLao";
import { GourdEffectZhengXianHongHuLu } from "db://assets/Script/Drink/Gourd/Effects/GourdEffectZhengXianHongHuLu";
import { GourdEffectWuGuiHuLu } from "db://assets/Script/Drink/Gourd/Effects/GourdEffectWuGuiHuLu";
import { GourdEffectQianKunCaiHuLu } from "db://assets/Script/Drink/Gourd/Effects/GourdEffectQianKunCaiHuLu";
import {
    IngredientEffectTieGuYinShen
} from "db://assets/Script/Drink/InfusedIngredient/Effects/IngredientEffectTieGuYinShen";
import { IngredientEffectNenYuOu } from "db://assets/Script/Drink/InfusedIngredient/Effects/IngredientEffectNenYuOu";
import {
    IngredientEffectBaiHuaRui
} from "db://assets/Script/Drink/InfusedIngredient/Effects/IngredientEffectBaiHuaRui";
import { LiquorEffectYeZiJiu } from "db://assets/Script/Drink/Liquor/Effects/LiquorEffectYeZiJiu";
import { LiquorEffectGaoErNiang } from "db://assets/Script/Drink/Liquor/Effects/LiquorEffectGaoErNiang";

/**
 * 数据资源路径常量
 */
export enum DataPath {
    /**
     * 道具配置表
     */
    ITEMS = 'data/items',

    /**
     * 装备配置表
     */
    EQUIPMENTS = 'data/equipments',

    /**
     * 葫芦配置表
     */
    GOURDS = 'data/gourds',

    /**
     * 酒配置表
     */
    LIQUORS = 'data/liquors',

    /**
     * 泡酒物配置表
     */
    INFUSED_INGREDIENTS = 'data/infused_ingredients',

    /**
     * 铸造配方配置表
     */
    CRAFT_RECIPES = 'data/craft_recipes',

    /**
     * 升阶配方配置表
     */
    UPGRADE_RECIPES = 'data/upgrade_recipes',

    /**
     * 敌人配置表
     */
    ENEMY_TABLES = 'data/enemies',

    /**
     * 关卡配置表
     */
    STAGE_TABLES = 'data/stages',

    /**
     * 区域配置表
     */
    AREA_TABLES = 'data/areas',

    /**
     * 章节配置表
     */
    CHAPTERS = 'data/chapters',

    /**
     * 玩家贩卖品表
     */
    SELLABLES = 'data/sellables',

    /**
     * 商店配置表
     */
    SHOPS = 'data/shops',
}

/**
 * 物品表
 */
export const ITEM_META_TABLE = new Map<string, ItemMeta>();

/**
 * 铸造配方表
 */
export const CRAFT_RECIPE_TABLE = new Map<string, CraftRecipe>();

/**
 * 升阶配方表
 */
export const UPGRADE_RECIPE_LIST: UpgradeRecipe[] = [];

/**
 * 敌人表
 */
export const ENEMY_TABLE = new Map<string, EnemyInfo>();

/**
 * 舞台表
 */
export const STAGE_TABLE = new Map<string, Stage>();

/**
 * 区域表
 */
export const AREA_TABLE = new Map<string, Area>();
export const AREAS: Area[] = [];

/**
 * 章节表
 */
export const CHAPTER_TABLE = new Map<string, Chapter>();
export const CHAPTERS: Chapter[] = [];

/**
 * 商店表
 */
export const SHOP_TABLE = new Map<string, Shop>();

/**
 * 被动效果表
 */
export const PASSIVE_EFFECT_TABLE = new Map<string, PassiveEffect>();

// 装备
PASSIVE_EFFECT_TABLE.set(UniqueUtilityLinGunShuangShe.NAME, new UniqueUtilityLinGunShuangShe());
PASSIVE_EFFECT_TABLE.set(UniqueUtilityBaiLianZi.NAME, new UniqueUtilityBaiLianZi());

// 葫芦
PASSIVE_EFFECT_TABLE.set(GourdEffectZhengXianHongHuLu.NAME, new GourdEffectZhengXianHongHuLu());
PASSIVE_EFFECT_TABLE.set(GourdEffectWuGuiHuLu.NAME, new GourdEffectWuGuiHuLu());
PASSIVE_EFFECT_TABLE.set(GourdEffectQianKunCaiHuLu.NAME, new GourdEffectQianKunCaiHuLu());

// 酒
PASSIVE_EFFECT_TABLE.set(LiquorEffectYeZiJiu.NAME, new LiquorEffectYeZiJiu());
PASSIVE_EFFECT_TABLE.set(LiquorEffectGaoErNiang.NAME, new LiquorEffectGaoErNiang());
PASSIVE_EFFECT_TABLE.set(LiquorEffectSongLao.NAME, new LiquorEffectSongLao());

// 泡酒物
PASSIVE_EFFECT_TABLE.set(IngredientEffectTieGuYinShen.NAME, new IngredientEffectTieGuYinShen());
PASSIVE_EFFECT_TABLE.set(IngredientEffectNenYuOu.NAME, new IngredientEffectNenYuOu());
PASSIVE_EFFECT_TABLE.set(IngredientEffectBaiHuaRui.NAME, new IngredientEffectBaiHuaRui());

/**
 * 套装效果 Map
 *
 * 效果名 -> 套装效果
 */
export const SET_BONUS_TABLE = new Map<string, SetBonus>();
SET_BONUS_TABLE.set(SetBonusEffectZiZhuBiJiao.NAME, new SetBonus(SetBonusEffectZiZhuBiJiao.NAME, SetBonusEffectZiZhuBiJiao.REQUIREMENT, new SetBonusEffectZiZhuBiJiao()));

/**
 * 天赋树
 */
export const TALENT_TREE = new Map<string, TalentTreeNode>();
TALENT_TREE.set(TalentTiJian.NAME, new TalentTreeNode(new TalentTiJian(), null, [], false, true));
TALENT_TREE.set(TalentShiPo.NAME, new TalentTreeNode(new TalentShiPo(), null, [], false, true));
