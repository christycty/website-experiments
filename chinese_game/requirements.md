[技術需求文件] 2026 淘寶年貨節：打年獸互動遊戲
版本： 1.0
日期： 2026-01-04
狀態： 草案（Draft）
1. 項目概述 (Project Overview)
開發一款基於 H5 的點擊類養成遊戲（Idle/Clicker Game），用戶透過完成任務獲得「爆竹」，消耗爆竹擊退「年獸」以獲取購物紅包。需具備跨平台流暢度（iOS/Android）與高併發處理能力。
2. 技術棧 (Technical Stack)
前端引擎： PixiJS v8.0+ (渲染) + GSAP (補間動畫)
動畫格式： Spine 4.2 (骨骼動畫)
前端框架： Vue 3 / React (UI 介面層)
後端： Node.js (NestJS) 或 Go (高效能處理)
數據庫： Redis (即時緩存) + MySQL (持久化數據)
通信協議： HTTPS (RESTful API) + WebSocket (即時進度更新)
3. 核心功能規格 (Functional Requirements)
3.1 遊戲循環 (Core Loop)
資源獲取： 用戶透過 API 請求獲取任務列表，完成後後端更新 firecracker_count。
戰鬥交互：
點擊年獸觸發 onTap 事件。
消耗爆竹，前端計算並顯示 damage_number 飄字特效。
年獸 HP 條即時扣除。
狀態持久化： 每隔 3-5 秒或在關鍵節點（如過關時），前端將進度同步至伺服器。
3.2 角色動畫狀態機
狀態	觸發條件	動畫表現
Idle	無輸入	呼吸、尾巴擺動 (Loop)
Hurt	玩家點擊/使用爆竹	身體震動、變紅、受傷表情
Attack	特定機率觸發	年獸反擊（僅特效，不扣玩家分）
Death	HP = 0	煙霧消散、化為紅包雨
3.3 任務系統 (Task Engine)
類型： 每日簽到、頁面停留（15s）、指定商品跳轉。
防刷機制： 每個任務請求需帶有 nonce 與 signature 驗證，防止惡意指令碼直接調用完成介面。
4. 非功能性需求 (Non-Functional Requirements)
4.1 性能指標
FPS： 在 iPhone 13 / 高通 8 Gen 2 以上設備穩定在 60 FPS。
首屏加載： 使用分包加載（Bundle Splitting），核心靜態資源（Lottie/Spine）需在 2 秒內完成預加載。
資源壓縮： 所有圖片需轉為 WebP 格式，Spine 文件需進行二進制導出。
4.2 擴展性與安全性
併發處理： 活動高峰期（如除夕）需支持每秒萬級 (QPS) 的打擊請求，採用 Redis 原子操作 DECR 處理血量扣除。
作弊防禦： 後端需驗證打擊頻率，若點擊頻率大於 20次/秒，判定為插件，暫停記錄。
5. API 介面設計 (簡約版)
[GET] /api/v1/user/status
描述： 獲取用戶當前血量、等級、爆竹餘額。
返回： { "hp": 500, "max_hp": 1000, "items": 50, "level": 1 }
[POST] /api/v1/game/attack
描述： 上傳攻擊動作。
參數： { "count": 10, "timestamp": 1735987200 }
返回： { "reward_triggered": true, "reward_type": "coupon" }
6. 開發里程碑 (Milestones)
W1： 核心引擎搭建、Spine 資源導入、基礎點擊邏輯完成。
W2： 接入後端 API、任務列表系統、UI 介面開發。
W3： 特效與音效優化、壓力測試、防作弊邏輯部署。
W4： 灰度發佈 (Gray Release) 與正式上線。
附錄：相關工具連結
PixiJS 官方文檔
GSAP 動畫庫
Spine 運行時手冊



