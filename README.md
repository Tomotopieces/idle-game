# idle-game

闲得没事做的挂机类型游戏，自动战斗打怪升级

> 玩法抄袭：[🐢超级龟龟放置](https://superturtleidle.github.io/)
>
> 内容抄袭：[🐒黑神话：悟空](https://heishenhua.com/)

## 环境与版本

- Cocos Creator 3.8.4
- AndroidSDK 34 (无后缀)
- AndroidNDK 23.1.7779620
- Java 17.0.12

## Roadmap

### Alpha 0.2

- [ ] 代码重构 **👈进行中**
    - [x] ~~使用 Typescript strict 模式，规范代码~~
      - 取消，非严格模式的类型安全已经够了
    - [x] 删除重复的逻辑安全判断
    - [ ] 消息提醒、物品信息卡片、天赋信息卡片抽象出一个可复用的预制件
    - [ ] 重构仓库物品面板的物品槽逻辑，改用Layout，避免重复进行大量的节点增删
    - [ ] 部分自动循环逻辑改为Cocos的schedule实现，而不是手动在update中计算deltaTime
    - [ ] 重新整理与天赋相关的技能逻辑
- [ ] UI优化
    - [ ] 更新屏幕自适应方案，使得内容自动对齐屏幕边缘
    - [ ] 优化物品卡片的独门效用与套装效果的显示效果，添加物品介绍展示
    - [ ] 优化消息提醒的物品名显示效果
      - 消息类型？
- [ ] 商店系统（土地庙-货殖）
    - [ ] 买入
        - [ ] 不同区域的土地庙所售物品不同
    - [ ] 卖出
        - [ ] 添加“贩卖品”物品类型，设定卖出价格
- [ ] 葫芦系统
    - [ ] 不同酒或葫芦，提供不同的回血效果和其他特殊效果
        - 恢复量和饮用次数？
        - 酒的填充条件？
        - 泡酒物？
    - [ ] 酒与葫芦的升级
- [ ] 复活功能
  - [ ] 玩家死亡&复活动画
  - [ ] 玩家死亡后，每次点击玩家，恢复20%生命值
  - [ ] 玩家死亡后，暂停update内容
  - [ ] 玩家死亡后，敌人停止攻击

<span style="color: black; background-color: black;">卧槽我竟然把 0.1 做完了</span>

---

### Alpha 0.1.1

作为 Alpha 0.1 的必要补充，也作为 Alpha 0.1 的一部分

- [x] 消息系统
    - [x] 弹出消息并在一定时间后~~或用户点击后~~自动消失
    - [x] 多条消息时，旧消息会将新消息上顶，消息总数不超过某个值
- [x] 天赋系统
    - [x] 天赋点数
    - [x] 天赋设计
        - 部分内容依赖技能系统

---

### Alpha 0.1

- [x] 战斗系统
    - [x] 基础自动战斗
    - [x] 重写结合属性计算的伤害公式逻辑
- [x] 存档系统
    - [x] 基础逻辑
    - [x] UI提示
        - 依赖消息系统
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
- [x] 锻造系统
    - [x] 打造新的武器装备
    - [x] 升级现有的武器装备
        - 需要重构武器数据结构
- [x] 角色升级
    - [x] 敌人提供经验
    - [x] 升级提供属性成长
    - [x] 升级提供天赋点数
        - 依赖天赋系统
- [x] 技能系统
    - [x] 自动释放的攻击型技能
    - [x] ~~数值或机制类型的被动技能~~
        - 被动效果 = 天赋

## 杂项

### 数据管理

1. `assets`: 存放游戏基本资源，贴图、音频、脚本、数据文件等
    - 静态资源文件名使用大驼峰
    - 动态资源文件名使用全小写+下划线分词
2. `sys.localStorage`: 仅存放游戏存档数据（类似./save)
    - 保存内容为JSON格式字符串，不存在类型
3. ~~`GlobalThis`：存放全局变量，当前游戏状态，如角色信息、仓库内容、战斗信息等~~
    - ~~保存内容为对象引用，存在类型~~
4. `DataTable.ts`：存放游戏资源数据，如物品、装备、关卡、敌人等，模块化管理

### 问题记录

1. Cocos Creator 3.8.4 bug：`assets/resources/`目录下的动态资源文件，在新增或调整位置后，无法读取，须重启编辑器
2. 默认active为false的Node无法自行激活，须通过其他Node来调整，切记切记
3. Windows Git 对文件名大小写默认不敏感，需要配置Git忽略大小写：`git config core.ignorecase false`
4. `instantiate(Prefab)`方法创建的Node，生命周期上还**没有**执行过`onLoad`方法，不能在里面进行初始化操作，需要先挂载到父节点下
