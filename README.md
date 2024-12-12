# idle-game

## 环境与版本

- Cocos Creator 3.8.4
- AndroidSDK 34 (无后缀)
- AndroidNDK 23.1.7779620
- Java 17.0.12

## Roadmap

> 玩法抄袭：[🐢超级龟龟放置](https://superturtleidle.github.io/)
>
> 内容抄袭：[🐒黑神话：悟空](https://heishenhua.com/)

- [x] 战斗系统
    - [x] 基础自动战斗
    - [x] 重写结合属性计算的伤害公式逻辑
- [x] 存档系统
    - [x] 基础逻辑
    - [ ] UI提示
- [x] 道具系统
    - [x] 基础逻辑
    - [x] ~~把金币（灵韵）剔除出道具，另外计算~~
        - 就这么着吧
    - [x] 完成仓库的UI
        - [x] 物品展示
        - [x] 设计实现交互逻辑
          - [x] 物品信息卡片
- [x] 关卡系统
    - [x] 多个Level，每个Level有若干个Stage，每个Stage有固定一个Enemy
    - [x] 切换Level和Stage时自动切换Enemy
    - [x] 存档记录Level和Stage，而不是Enemy
- [x] 装备系统
    - [x] 使得装备类型道具可以装备
        - [x] 套装效果
    - [x] 可以提升角色属性
    - [x] 可以提供数据外的特殊效果
- [ ] 锻造系统
    - [ ] 打造新的武器装备
    - [ ] 升级现有的武器装备
- [ ] 角色升级 **👈进行中**
    - [ ] 敌人提供经验
    - [ ] 升级后提供天赋点数
- [ ] 技能系统
    - [ ] 自动释放的攻击型技能
    - [ ] 数值或机制类型的被动技能
- 待定······

## 杂项

### 数据管理

1. `assets`: 存放游戏基本资源，贴图、音频、脚本、数据文件等
    - 静态资源文件名使用大驼峰
    - 动态资源文件名使用全小写+下划线分词
2. `sys.localStorage`: 仅存放游戏存档数据（类似./save)
    - 保存内容为JSON格式字符串，不存在类型
3. `GlobalThis`：存放全局变量，当前游戏状态，如角色信息、仓库内容、战斗信息等
    - 保存内容为对象引用，存在类型

### 问题记录

1. Cocos Creator 3.8.4 bug：`assets/resources/`目录下的动态资源文件，在新增或调整位置后，无法读取，须重启编辑器
    - 好像是Git的文件名大小写不敏感导致的，有待验证
2. 默认active为false的Node无法自行激活，须通过其他Node来调整，切记切记
3. Windows Git 对文件名大小写默认不敏感，需要配置Git忽略大小写：`git config core.ignorecase false`
4. `instantiate(Prefab)`方法创建的Node，生命周期上还**没有**执行过`onLoad`方法，不能在里面进行初始化操作
