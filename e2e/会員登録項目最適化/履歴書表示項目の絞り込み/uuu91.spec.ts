import { test, expect } from "@playwright/test";
import path from "path";
import { STORAGE_STATE_DIR } from "../../../playwright.config";
import { login } from "../../fixtures/login";

test.describe.configure({ mode: "parallel" });
// バイト求人への応募から会員登録したユーザー
const statePath = path.join(STORAGE_STATE_DIR, "user-uuu91.json");
// バイト求人への応募から会員登録したユーザー
// 現在の職業: 正社員, 就業経験: 派遣・バイト・パート
// 職務経歴0件
const loginIdPatterns = {
  loginId: "uuu91@g.com",
  password: "password",
};

test.beforeAll("login", async () => {
  const loginId = loginIdPatterns.loginId;
  const password = loginIdPatterns.password;
  await login(loginId, password, statePath);
});

const applyBaitoFormPage = "/user/apply/form/?work_id=860&aroute=1105&PK=304792&company_id=1468";
const applyBaitoConfirm = "/user/apply/confirm/?work_id=860&aroute=1105&aroute=1105&PK=304792";
const applyFormPage = "/user/apply/form/?work_id=860&aroute=1105&PK=304792&company_id=1468";
const applyConfirm = "/user/apply/confirm/?work_id=860&aroute=1105&aroute=1105&PK=304792";
const resume = "/user/setting/resume";
const favorite = "/user/favorite";


test("バイト求人への求人への応募内容確認画面 @apply-confirm", async ({ browser }) => {
  const context = await browser.newContext({ storageState: statePath });
  const page = await context.newPage();

  await page.goto(applyBaitoConfirm, { waitUntil: "load" });

  await page.waitForURL(/\/user\/apply\/confirm/, { timeout: 100 })

  // visible
  // プロフィール内の「経験されたお仕事やスキル」
  await expect(
    page
      .locator(".dataSetTable")
      .first()
      .getByText("経験されたお仕事やスキル", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("最終学歴", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("転職経験", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("現在(直近)の経験職種", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("直近の年収", { exact: true })
  ).toBeVisible();
	
	// hidden
  await expect(
    page.getByText("職務経歴", { exact: true })
  ).toBeHidden();
});

test("バイト求人への求人への応募内容編集画面 @apply-form", async ({ browser }) => {
  const context = await browser.newContext({ storageState: statePath });
  const page = await context.newPage();

  await page.goto(applyBaitoFormPage, { waitUntil: "load" });

  await page.waitForURL(/\/user\/apply\/form/)

  // visible
  // プロフィール内の「経験されたお仕事やスキル」
  await expect(
    page
      .locator(".dataSetTable")
      .first()
      .getByText("経験されたお仕事やスキル", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("最終学歴", { exact: true })
  ).toBeVisible();
	
	// hidden
  await expect(
    page.getByText("職務経歴", { exact: true })
  ).toBeHidden();
	await expect(
    page.getByText("転職経験", { exact: true })
  ).toBeHidden();
  await expect(
    page.getByText("現在（直近）の経験職種", { exact: true })
  ).toBeHidden();
	await expect(
    page.getByText("直近の年収", { exact: true })
  ).toBeHidden();
});

// バイト求人と表示項目は同じ
test("求人への応募内容確認画面 @apply-confirm", async ({ browser }) => {
  const context = await browser.newContext({ storageState: statePath });
  const page = await context.newPage();

  await page.goto(applyConfirm, { waitUntil: "load" });

  await page.waitForURL(/\/user\/apply\/confirm/)

  // visible
  // プロフィール内の「経験されたお仕事やスキル」
  await expect(
    page
      .locator(".dataSetTable")
      .first()
      .getByText("経験されたお仕事やスキル", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("最終学歴", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("転職経験", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("現在(直近)の経験職種", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("直近の年収", { exact: true })
  ).toBeVisible();
	
	// hidden
  await expect(
    page.getByText("職務経歴", { exact: true })
  ).toBeHidden();
});

// バイト求人と表示項目は同じ
test("求人への応募内容編集画面 @apply-form", async ({ browser }) => {
  const context = await browser.newContext({ storageState: statePath });
  const page = await context.newPage();

  await page.goto(applyFormPage, { waitUntil: "load" });

  await page.waitForURL(/\/user\/apply\/form/)

  // visible
  // プロフィール内の「経験されたお仕事やスキル」
  await expect(
    await page
      .locator(".cardContent.cardContent--form")
      .first()
      .getByText("経験されたお仕事やスキル", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("最終学歴", { exact: true })
  ).toBeVisible();
	
	// hidden
  await expect(
    page.getByText("職務経歴", { exact: true })
  ).toBeHidden();
	await expect(
    page.getByText("転職経験", { exact: true })
  ).toBeHidden();
  await expect(
    page.getByText("現在（直近）の経験職種", { exact: true })
  ).toBeHidden();
	await expect(
    page.getByText("直近の年収", { exact: true })
  ).toBeHidden();
});

test("resume @resume", async ({ browser }) => {
  const context = await browser.newContext({ storageState: statePath });
  const page = await context.newPage();

  await page.goto(resume, { waitUntil: "load" });

  await page.waitForURL(/\/user\/setting\/resume/, { timeout: 100 });

  // visible
  await expect(
    page.getByText("最終学歴", { exact: true })
  ).toBeVisible();
  // プロフィール内の「経験されたお仕事やスキル」
  await expect(
    await page
      .locator(".cardContent.cardContent--form")
      .first()
      .getByText("経験されたお仕事やスキル", { exact: true })
  ).toBeVisible();

  // hidden
  await expect(
    page.getByText("転職経験", { exact: true })
  ).toBeHidden();
  await expect(
    page.getByText("現在（直近）の経験職種", { exact: true })
  ).toBeHidden();
  await expect(
    page.getByText("直近の年収", { exact: true })
  ).toBeHidden();
  await expect(
    page.getByText("職務経歴", { exact: true })
  ).toBeHidden();
});

// いいねが0件
// test("いいね一覧からの一括応募で応募内容確認画面 @apply-confirm", async ({ browser }) => {
//   const context = await browser.newContext({ storageState: statePath });
//   const page = await context.newPage();

//   await page.goto(favorite, { waitUntil: "load" });

//   await page.waitForURL(/\/user\/favorite/, { timeout: 100 });

//   await page.waitForResponse(/\/user\/favorite\/list/);
//   await expect(
//     await page.getByRole("link", { name: "応募へ進む" })
//   ).toHaveCount(3);

//   await page.getByRole("link", { name: "まとめて応募" }).click();

//   await page.waitForURL(/\/user\/apply\/confirm/);

//   // visible
//   await expect(
//     page.getByText("最終学歴", { exact: true })
//   ).toBeVisible();
//   await expect(
//     await page
//       .locator(".dataSetTable")
//       .nth(1)
//       .getByText("経験されたお仕事やスキル", { exact: true }) // 職務経歴（2）では登録していないので1件のみ
//   ).toHaveCount(1);

//   // hidden
//   await expect(
//     page.getByText("転職経験", { exact: true })
//   ).toBeHidden();
//   await expect(
//     page.getByText("現在(直近)の経験職種", { exact: true })
//   ).toBeHidden();
//   await expect(
//     page.getByText("直近の年収", { exact: true })
//   ).toBeHidden();
//   await expect(
//     page.getByText("職務経歴", { exact: true })
//   ).toBeHidden();
//   // プロフィール内の「経験されたお仕事やスキル」
//   await expect(
//     await page
//       .locator(".dataSetTable")
//       .first()
//       .getByText("経験されたお仕事やスキル", { exact: true })
//   ).toBeHidden();
// });
