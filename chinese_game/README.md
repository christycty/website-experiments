# 打年獸遊戲 🧨

一個純靜態的中國新年主題點擊遊戲，使用 PixiJS 和 GSAP 製作。

## 🎮 遊戲特色

- **純靜態實現** - 無需 npm、無需建置工具
- **射擊玩法** - 發射煙火擊中移動的年獸
- **動態目標** - 年獸在螢幕上方左右移動
- **旋轉發射器** - 底部煙火發射器自動旋轉瞄準
- **關卡系統** - 擊敗年獸進入下一關
- **每日任務** - 完成任務獲得爆竹獎勵
- **進度保存** - 使用 localStorage 自動保存
- **響應式設計** - 支援桌面和移動設備
- **程序化音效** - 內建 Web Audio API 音效生成器

## 🚀 快速開始

### 方法 1: 直接開啟

1. 下載整個 `chinese_game` 資料夾
2. 用瀏覽器開啟 `index.html`
3. 開始遊戲！

### 方法 2: 本地伺服器（推薦）

```bash
# 使用 Python
cd chinese_game
python -m http.server 8000

# 或使用 Node.js
npx http-server -p 8000

# 然後在瀏覽器開啟
# http://localhost:8000
```

### 方法 3: 部署到 GitHub Pages

1. 建立 GitHub 倉庫
2. 上傳所有檔案
3. 在設定中啟用 GitHub Pages
4. 訪問 `https://yourusername.github.io/chinese_game/`

## 📁 專案結構

```
chinese_game/
├── index.html              # 遊戲入口
├── styles/
│   └── main.css           # 全域樣式
├── js/
│   ├── main.js            # 主程式入口
│   ├── config/            # 遊戲配置
│   │   ├── game.js        # 遊戲常數
│   │   └── levels.js      # 關卡定義
│   ├── core/              # 核心系統
│   │   ├── Application.js # PixiJS 包裝器
│   │   ├── AssetLoader.js # 資源載入器
│   │   └── GameLoop.js    # 遊戲循環
│   ├── entities/          # 遊戲實體
│   │   ├── YearBeast.js   # 年獸（移動目標）
│   │   ├── Shooter.js     # 煙火發射器
│   │   ├── Firework.js    # 煙火彈道
│   │   └── DamageNumber.js # 傷害數字
│   ├── systems/           # 遊戲系統
│   │   ├── CombatSystem.js    # 戰鬥系統
│   │   ├── TaskSystem.js      # 任務系統
│   │   └── StateMachine.js    # 狀態機
│   ├── ui/                # UI 控制器
│   │   ├── HudOverlay.js  # HUD 顯示
│   │   └── TaskPanel.js   # 任務面板
│   └── utils/             # 工具函數
│       ├── store.js       # 狀態管理
│       ├── security.js    # 安全檢查
│       └── soundGenerator.js # 程序化音效生成器
└── assets/                # 遊戲資源
    ├── images/            # 圖片資源
    ├── spine/             # Spine 動畫
    └── sounds/            # 音效資源
```

## 🛠️ 技術棧

| 層級 | 技術 | 來源 | 大小 |
|------|------|------|------|
| **渲染引擎** | PixiJS 8 | CDN | ~200KB |
| **動畫庫** | GSAP 3 | CDN | ~50KB |
| **Spine 運行時** | pixi-spine | CDN | ~100KB |
| **UI** | Vanilla JS | 原生 | 0KB |
| **狀態管理** | LocalStorage | 原生 | 0KB |
| **模組系統** | ES6 Modules | 原生 | 0KB |

**總大小:** ~350KB (gzip 後約 120KB)

## 🎮 遊戲玩法

### 射擊機制

1. **年獸移動** - 年獸在螢幕上方左右移動
2. **瞄準發射** - 底部的煙火發射器自動左右旋轉（90度範圍）
3. **點擊發射** - 點擊螢幕任何位置發射煙火
4. **擊中得分** - 煙火擊中年獸造成傷害
5. **消耗爆竹** - 每次發射消耗 1 個爆竹

### 遊戲目標

1. **擊敗年獸** - 將年獸血量降至 0
2. **進入下一關** - 每關年獸血量增加
3. **完成任務** - 獲得爆竹獎勵
   - 每日登入：+50 爆竹
   - 停留 15 秒：+30 爆竹
   - 點擊 100 次：+100 爆竹
4. **暴擊系統** - 15% 機率造成 2 倍傷害

### 操作說明

- **發射煙火** - 點擊螢幕任何位置
- **瞄準技巧** - 觀察發射器旋轉角度，預判年獸移動位置
- **連續射擊** - 快速點擊可發射多個煙火
- **牆壁反彈** - 煙火會在左右牆壁反彈，可利用反彈角度擊中年獸

## 🎨 添加資源

### 圖片資源

將以下檔案放入 `assets/images/`:
- `bg.jpg` - 背景圖片 (建議 750x1334px)
- `firecracker.png` - 爆竹圖示 (建議 64x64px)

### Spine 動畫（可選）

將以下檔案放入 `assets/spine/`:
- `beast.json` - Spine 骨架資料
- `beast.atlas` - Spine 紋理圖集
- `beast.png` - Spine 紋理圖片

**注意:** 如果沒有 Spine 資源，遊戲會自動使用備用精靈圖。

**添加真實 Spine 動畫:**
1. 從 Spine Editor 導出 JSON 格式
2. 確保包含動畫: `idle`, `hurt`, `death`
3. 將 `.json`, `.atlas`, `.png` 放入 `assets/spine/`
4. 重新載入遊戲

### 音效（可選）

將以下檔案放入 `assets/sounds/`:
- `bgm.mp3` - 背景音樂
- `hit.mp3` - 攻擊音效
- `victory.mp3` - 勝利音效
- `button.mp3` - 按鈕音效

**注意:** 如果沒有音效檔案，遊戲會自動使用程序化生成的音效（使用 Web Audio API）。

## 🎵 音效系統

遊戲包含智能音效系統：

1. **優先使用 MP3 檔案** - 如果 `assets/sounds/` 中有音效檔案
2. **自動降級** - 如果檔案不存在，使用程序化音效
3. **程序化音效** - 使用 Web Audio API 即時生成
   - `hit` - 短促的打擊音效 (800Hz → 100Hz 頻率掃描)
   - `victory` - 勝利和弦音效 (C-E-G-C 音符)
   - `button` - 按鈕點擊音效 (600Hz → 400Hz)

無需任何配置，音效系統會自動選擇最佳方案！

## 🔧 自訂設定

編輯 `js/config/game.js` 來調整遊戲參數：

```javascript
export const GAME_CONFIG = {
  DAMAGE_PER_FIRECRACKER: 10,  // 每個爆竹的傷害
  CRIT_CHANCE: 0.15,            // 暴擊機率
  CRIT_MULTIPLIER: 2,           // 暴擊倍數
  STARTING_FIRECRACKERS: 5000,  // 初始爆竹數量
  SCREEN_WIDTH: 750,            // 畫布寬度
  SCREEN_HEIGHT: 1334,          // 畫布高度
};
```

## 🐛 除錯與測試

### 開發工具

開啟瀏覽器控制台（F12）可以：
- 查看遊戲日誌
- 訪問全域變數：
  - `window.gameStore` - 遊戲狀態
  - `window.gameApp` - PixiJS 應用
  - `window.taskSystem` - 任務系統
  - `window.gameSecurity` - 安全管理器

### 除錯命令

```javascript
// 查看遊戲狀態
window.gameStore.state

// 重置遊戲進度
window.gameStore.reset()

// 添加爆竹
window.gameStore.addFirecrackers(100)

// 測試音效
window.gameApp.combatSystem.playSoundEffect('hit')

// 查看年獸位置
window.gameApp.yearBeast.sprite.x
```

### 常見問題

**沒有聲音:**
- 檢查瀏覽器是否靜音
- 檢查系統音量
- 點擊年獸（某些瀏覽器需要用戶互動）
- 查看控制台錯誤訊息

**年獸移動:**
- 清除瀏覽器快取（Ctrl+Shift+Delete）
- 硬重新整理（Ctrl+F5）

**404 錯誤:**
- 確認檔案存在於 `assets/` 資料夾
- 檢查檔案名稱是否正確
- 重新啟動本地伺服器

**效能問題:**
- 關閉其他分頁
- 檢查 CPU 使用率
- 嘗試不同瀏覽器

## 📱 瀏覽器支援

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

需要支援：
- ES6 Modules
- LocalStorage
- Canvas API
- Web Audio API（音效）

## 🔧 版本歷史

### v2.1 (2026-01-04) - 平衡性調整

**修復:**
- 🐛 修復年獸受傷時的 GSAP scale 錯誤（null 檢查）
- 🛡️ 添加 sprite 存在性檢查，防止動畫錯誤

**平衡性調整:**
- ⚡ 煙火速度提升：8 → 12 (更快)
- 🐌 年獸移動速度降低：2 → 1 (更慢，更容易瞄準)
- 🔄 發射器旋轉速度降低：0.02 → 0.01 (更慢，更容易控制)
- 🎱 煙火現在會在左右牆壁反彈（增加趣味性）

### v2.0 (2026-01-04) - 射擊遊戲重製版

**重大更新:**
- 🎮 完全重新設計遊戲機制為射擊遊戲
- 🎯 年獸現在會在螢幕上方左右移動
- 🚀 新增煙火發射器系統（底部中央，自動旋轉）
- 💥 新增煙火彈道與碰撞檢測系統
- 🎨 點擊螢幕發射煙火，擊中年獸造成傷害

**新增實體:**
- ✨ `Shooter.js` - 可旋轉的煙火發射器
- ✨ `Firework.js` - 煙火彈道與爆炸效果

**改進:**
- 🎯 年獸移動更流暢，會在邊界反彈
- 🔄 發射器持續旋轉 90 度範圍
- 💫 煙火擊中時有爆炸特效
- 🎮 更具挑戰性的瞄準玩法

### v1.2

**修復:**
- ✅ 修正初始爆竹數量為 5000
- ✅ 修復每日登入任務領取功能
- ✅ 修復停留時間任務計時器

### v1.1

**修復:**
- ✅ 修復音效無法播放的問題
- ✅ 添加程序化音效生成器

## 📄 授權

本專案僅供學習和實驗使用。

## 🙏 致謝

- [PixiJS](https://pixijs.com/) - 2D 渲染引擎
- [GSAP](https://greensock.com/gsap/) - 動畫庫
- [pixi-spine](https://github.com/pixijs/spine) - Spine 運行時

## 📞 支援

如有問題或建議，請開啟 Issue。

---

**祝您遊戲愉快！🎉**
