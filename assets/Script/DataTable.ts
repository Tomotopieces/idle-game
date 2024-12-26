import { Area } from "db://assets/Script/Level/Area";
import { Stage } from "db://assets/Script/Level/Stage";
import { Item } from "db://assets/Script/Item/Item";
import { EnemyInfo } from "db://assets/Script/Entity/Enemy/EnemyInfo";
import { UniqueEffect } from "db://assets/Script/Item/Equipment/UniqueEffect/UniqueEffect";
import {
    UniqueEffectLinGunShuangShe
} from "db://assets/Script/Item/Equipment/UniqueEffect/UniqueEffectLinGunShuangShe";
import { SetEffect } from "db://assets/Script/Item/Equipment/SetEffect/SetEffect";
import { SetEffectZiZhuBiJiao } from "db://assets/Script/Item/Equipment/SetEffect/SetEffectZiZhuBiJiao";
import { TalentTreeNode } from "db://assets/Script/Talent/TalentTreeNode";
import { TalentTiJian } from "db://assets/Script/Talent/Talents/TalentTiJian";
import { TalentShiPo } from "db://assets/Script/Talent/Talents/TalentShiPo";
import { Chapter } from "db://assets/Script/Level/Chapter";
import { CraftRecipe } from "db://assets/Script/Recipe/CraftRecipe";
import { UpgradeRecipe } from "db://assets/Script/Recipe/UpgradeRecipe";

/**
 * 数据资源路径常量
 */
export enum DataPath {
    /**
     * 道具配置表
     */
    ITEM_TABLE = 'data/item_table',

    /**
     * 装备配置表
     */
    EQUIPMENT_TABLE = 'data/equipment_table',

    /**
     * 铸造配方配置表
     */
    CRAFT_RECIPE_TABLE = 'data/craft_recipe_table',

    /**
     * 升阶配方配置表
     */
    UPGRADE_RECIPE_TABLE = 'data/upgrade_recipe_table',

    /**
     * 敌人配置表
     */
    ENEMY_TABLE = 'data/enemy_table',

    /**
     * 关卡配置表
     */
    STAGE_TABLE = 'data/stage_table',

    /**
     * 区域配置表
     */
    AREA_TABLE = 'data/area_table',

    /**
     * 章节配置表
     */
    CHAPTER_TABLE = 'data/chapter_table',
}

/**
 * 道具表
 */
export const ITEM_TABLE = new Map<string, Item>();

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

/**
 * 章节表
 */
export const CHAPTER_TABLE = new Map<string, Chapter>();

/**
 * 独门妙用 Map
 *
 * 效果名（装备名） -> 效果
 */
export const UNIQUE_EFFECT_TABLE = new Map<string, UniqueEffect>();
UNIQUE_EFFECT_TABLE.set(UniqueEffectLinGunShuangShe.NAME, new UniqueEffectLinGunShuangShe());

/**
 * 套装效果 Map
 *
 * 效果名 -> 套装效果
 */
export const SET_EFFECT_TABLE = new Map<string, SetEffect>();
SET_EFFECT_TABLE.set(SetEffectZiZhuBiJiao.NAME, new SetEffectZiZhuBiJiao());

/**
 * 天赋树
 */
export const TALENT_TREE = new Map<string, TalentTreeNode>();
TALENT_TREE.set(TalentTiJian.NAME, new TalentTreeNode(new TalentTiJian(), null, [], false, true));
TALENT_TREE.set(TalentShiPo.NAME, new TalentTreeNode(new TalentShiPo(), null, [], false, true));
