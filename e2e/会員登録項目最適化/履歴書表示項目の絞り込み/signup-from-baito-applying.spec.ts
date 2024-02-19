import { test, expect } from "@playwright/test";
import path from "path";
import { STORAGE_STATE_DIR } from "../../../playwright.config";
import { login } from "../../fixtures/login";

test.describe.configure({ mode: "parallel" });

// バイト求人への応募から会員登録したユーザー
const statePath = path.join(STORAGE_STATE_DIR, "user-uuu90.json");
// バイト求人への応募から会員登録したユーザー
// 現在の職業: 正社員, 就業経験: 正社員
// 職務経歴0件
const loginIdPatterns = {
  loginId: "uuu90@g.com",
  password: "password",
};

test.beforeAll("login", async () => {
  const loginId = loginIdPatterns.loginId;
  const password = loginIdPatterns.password;
  await login(loginId, password, statePath);
});

const applyFormPageInSingUp =
  "/user/apply/form/?route=10&aroute=0&work_id=860&delivery_id=0&is_emp_work=&PK=6F6787&company_id=1656";
const applyConfirmInSignUp =
  "/user/apply/confirm/?route=10&aroute=0&work_id=860&delivery_id=&is_emp_work=&PK=6F6787";
const applyFormPage =
  "/user/apply/form/?aroute=0&work_id=860&delivery_id=0&PK=720CCF&company_id=1656";
const applyConfirm =
  "/user/apply/confirm/?aroute=0&work_id=860&delivery_id=0&PK=720CCF";
const resume = "/user/setting/resume";
const favorite = "/user/favorite";

test("バイト求人への応募内容編集画面(会員登録経由) @apply-form", async ({ browser }) => {
  const context = await browser.newContext({ storageState: statePath });
  const page = await context.newPage();

  await page.goto(applyFormPageInSingUp, { waitUntil: "load" });

  await page.waitForURL(/\/user\/apply\/form/, { timeout: 100 });

  // visible
  // プロフィール内の「経験されたお仕事やスキル」
  await expect(
    await page
      .getByText("経験されたお仕事やスキル", { exact: true })
  ).toHaveCount(1);

  // hidden
  await expect(
    page.getByText("最終学歴", { exact: true })
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
  await expect(
    page.getByText("職務経歴", { exact: true })
  ).toBeHidden();
});

// 会員登録経由では無いので、項目数は絞られない
test("バイト求人への応募内容編集画面  @apply-form", async ({ browser }) => {
  const context = await browser.newContext({ storageState: statePath });
  const page = await context.newPage();

  await page.goto(applyFormPage, { waitUntil: "load" });

  await page.waitForURL(/\/user\/apply\/form/, { timeout: 100 });

  // visible
  await expect(
    page.getByText("経験されたお仕事やスキル", { exact: true })
  ).toHaveCount(1);
  await expect(
    page.getByText("最終学歴", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("転職経験", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("現在（直近）の経験職種", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("直近の年収", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("職務経歴", { exact: true })
  ).toBeVisible();
});

test("バイト求人への応募内容確認画面(会員登録経由)  @apply-confirm", async ({ browser }) => {
  const context = await browser.newContext({ storageState: statePath });
  const page = await context.newPage();

  await page.goto(applyConfirmInSignUp, { waitUntil: "load" });

  await page.waitForURL(/\/user\/apply\/confirm/);

  // visible
  await expect(
    page.getByText("経験されたお仕事やスキル", { exact: true })
  ).toHaveCount(1);

  // hidden
  await expect(
    page.getByText("最終学歴", { exact: true })
  ).toBeHidden();
  await expect(
    page.getByText("転職経験", { exact: true })
  ).toBeHidden();
  await expect(
    page.getByText("現在(直近)の経験職種", { exact: true })
  ).toBeHidden();
  await expect(
    page.getByText("直近の年収", { exact: true })
  ).toBeHidden();
  await expect(
    page.getByText("職務経歴", { exact: true })
  ).toBeHidden();
});

// 会員登録経由では無いので、項目数は絞られない
test("バイト求人への応募内容確認画面  @apply-confirm", async ({ browser }) => {
  const context = await browser.newContext({ storageState: statePath });
  const page = await context.newPage();

  await page.goto(applyConfirm, { waitUntil: "load" });

  // 学歴情報が未登録なのでリダイレクトチェックで引っかかり編集画面へ
  await page.waitForURL(/\/user\/apply\/form/);

  // visible
  await expect(
    page.getByText("経験されたお仕事やスキル", { exact: true })
  ).toHaveCount(1);
  await expect(
    page.getByText("最終学歴", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("転職経験", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("現在（直近）の経験職種", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("直近の年収", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("職務経歴", { exact: true })
  ).toBeVisible();
});

test("resume @resume", async ({ browser }) => {
  const context = await browser.newContext({ storageState: statePath });
  const page = await context.newPage();

  await page.goto(resume, { waitUntil: "load" });

  await page.waitForURL(/\/user\/setting\/resume/);

  // visible
  await expect(
    page.getByText("最終学歴", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("転職経験", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("現在（直近）の経験職種", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("直近の年収", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("職務経歴", { exact: true })
  ).toBeVisible();
  await expect(
    page
      .locator(".profileWrap")
      .first()
      .getByText("経験されたお仕事やスキル", { exact: true })
  ).toBeVisible();
});

test("いいね一覧からの一括応募で応募内容編集画面 @apply-form", async ({ browser }) => {
  const context = await browser.newContext({ storageState: statePath });
  const page = await context.newPage();

  await page.goto(favorite, { waitUntil: "load" });

  await page.waitForURL(/\/user\/favorite/);

  await page.waitForResponse(/\/user\/favorite\/list/);
  await expect(
    await page.getByRole("link", { name: "応募へ進む" })
  ).toHaveCount(3);

  await page.getByRole("link", { name: "まとめて応募" }).click();

  // 学歴情報が未登録なのでリダイレクトチェックで引っかかり編集画面へ
  await page.waitForURL(/\/user\/apply\/form/);

  // visible
  await expect(
    page.getByText("経験されたお仕事やスキル", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("最終学歴", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("転職経験", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("現在（直近）の経験職種", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("直近の年収", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("職務経歴", { exact: true })
  ).toBeVisible();
});
