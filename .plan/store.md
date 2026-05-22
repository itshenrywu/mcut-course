## Plan: Centralize Saved Course Actions

把所有頁面上的收藏與取消收藏操作收斂到 Vuex store/index.js，讓 store 成為唯一的寫入入口。頁面只負責觸發 action 與顯示狀態，避免每個頁面各自處理 push/filter/setSavedCourse/updateSavedCourse 的重複邏輯。這次重構的關鍵不是單純搬程式，而是把資料流統一成「先讀當下 localStorage / store 狀態，再決定修改，再由 store 進行唯一持久化」，避免 race condition、避免多頁邏輯分歧，也避免 top-menu 與 my.vue 顯示不同步。

**Goal**
- 讓收藏資料只有一個寫入點，且該寫入點同時負責 localStorage、後端同步、以及 UI 更新通知。
- 讓頁面層只做使用者互動確認，不再直接處理 push/filter/setSavedCourse。
- 讓 top-menu.vue 與 my.vue 的收藏顯示來源跟 store 一致，不再自己維護一份可能過時的陣列。

**Current behavior to preserve**
- 已登入時仍保留跨裝置同步與衝突比較提示。
- 未登入時仍只寫 localStorage。
- 登出仍會清空收藏與同步相關狀態。
- 收藏頁仍要支援匯入、清除全部、清除當前學期、清除已下架課程、單門移除。
- 課程列表與課程詳情仍要能切換收藏、顯示收藏數、以及依收藏做衝堂判斷。

**Steps**
1. 先在 store/index.js 釐清現有責任邊界：保留 setSavedCourse 作為低階持久化 mutation，並確認 getSavedCourse 仍負責初始讀取、local 與 online 同步比對、以及衝突時的 swal 選擇流程。這一步要先確認哪些邏輯可以留在 getSavedCourse，哪些該下放或上收成 action。
2. 在 store/index.js 新增高階 actions，集中處理所有收藏操作，至少包含 addSavedCourse、removeSavedCourse、toggleSavedCourse、replaceSavedCourse、clearSavedCourse、clearSavedCourseByTerm、clearSavedRemovedCourse。這些 actions 在變更前要先重新讀取當下 localStorage 的 savedCourse 當作基底，再合併/修改，最後統一 commit setSavedCourse，避免舊的 in-memory 陣列覆蓋最新狀態。
3. 定義 action 的資料流規則，避免 race condition：每次操作都以 localStorage 內最新 savedCourse 為準，必要時再用 store.state.savedCourse 作為備援；action 不直接依賴頁面傳入的舊陣列；寫入時統一去重與排序策略；若需要同步後端，仍由 setSavedCourse 維持單一出口。
4. 讓 store actions 成為唯一的收藏寫入入口，將目前頁面中直接修改陣列再 commit 的邏輯移除。若需要通知 top-menu 或其他顯示來源，改成由 action 在成功後統一觸發一次更新來源，而不是各頁面自己 emit。
5. 逐頁替換呼叫點，優先處理有實際寫入的頁面：pages/saved.vue、pages/course/index.vue、pages/course/_term/_dept/_id.vue、pages/logout.vue。頁面只保留 UI 確認與當前選擇狀態，收藏變更交給 store action。
6. 同步更新讀取收藏狀態的頁面與元件，包含 components/top-menu.vue 與 pages/my.vue。top-menu.vue 要跟 store 狀態一致地顯示收藏數，my.vue 則要改成用統一的收藏來源來計算匯入與統計，避免它直接讀 localStorage.savedCourse 造成狀態分裂。
7. 最後整理使用者流程，確認登入後同步、登出清空、匯入收藏、清除本學期、單門收藏與取消收藏都仍然可用，且不會重複寫入 localStorage 或重複同步到後端。

**Relevant files**
- /Users/henrywu/Documents/GitHub/mcut-course/store/index.js — 新增收藏 action，保留同步與持久化核心，並作為唯一寫入入口。
- /Users/henrywu/Documents/GitHub/mcut-course/pages/saved.vue — 將清除、匯入、單門移除改成 dispatch store action。
- /Users/henrywu/Documents/GitHub/mcut-course/pages/course/index.vue — 將收藏/取消收藏與本班必修收藏改成 dispatch store action。
- /Users/henrywu/Documents/GitHub/mcut-course/pages/course/_term/_dept/_id.vue — 將單課收藏切換改成 dispatch store action。
- /Users/henrywu/Documents/GitHub/mcut-course/pages/logout.vue — 保留清空收藏，但確認只走 store 的統一入口。
- /Users/henrywu/Documents/GitHub/mcut-course/components/top-menu.vue — 改成跟 store 狀態一致地顯示收藏數，不再單獨維護一份收藏陣列。
- /Users/henrywu/Documents/GitHub/mcut-course/pages/my.vue — 改成使用統一收藏來源進行匯入與統計，不直接依賴 localStorage.savedCourse。

**Verification**
1. 先跑一次針對收藏呼叫點的全文搜尋，確認 pages 中沒有剩下直接 push/filter 後再 commit setSavedCourse 的寫法。
2. 檢查 top-menu 的收藏數是否會在收藏、取消收藏、清空、登入同步後即時更新，且與 store 內容一致。
3. 驗證以下流程：首頁進入收藏頁、課程列表收藏/取消收藏、課程詳情收藏/取消收藏、清除本學期、清除已下架、登出清空、匯入收藏到我的課表。
4. 若有可用測試或 lint 命令，再針對 store/index.js 與受影響頁面做最小範圍的 lint 或 typecheck。

**Decisions**
- 維持 setSavedCourse 作為唯一真正寫入 localStorage 與後端同步的底層方法，不直接移除。
- 將頁面層的收藏操作改為呼叫 store action，不再各自處理陣列變更細節。
- 先保留現有的 $root 事件做過渡，但若 store 與元件狀態已能一致，就優先把 top-menu.vue 與相關顯示改成直接依 store。
- my.vue 與 top-menu.vue 都列為正式重構範圍，不視為可選項。
- 要把 top-menu.vue 的收藏數完全改成 computed from store.state，並移除 updateSavedCourse 事件。
- 要把 my.vue 的匯入來源改成直接 dispatch 統一 action，以避免它手動讀 localStorage 造成不同步。