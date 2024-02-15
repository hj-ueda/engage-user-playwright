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

test("バイト求人への応募内容編集画面(会員登録経由)", async ({ browser }) => {
  const context = await browser.newContext({ storageState: statePath });
  const loggedInPage = await context.newPage();

  await loggedInPage.goto(applyFormPageInSingUp, { waitUntil: "load" });

  await loggedInPage.waitForURL(/\/user\/apply\/form/);

  // visible
  await expect(
    loggedInPage.getByText("経験されたお仕事やスキル", { exact: true })
  ).toBeVisible();

  // hidden
  await expect(
    loggedInPage.getByText("最終学歴", { exact: true })
  ).toBeHidden();
  await expect(
    loggedInPage.getByText("転職経験", { exact: true })
  ).toBeHidden();
  await expect(
    loggedInPage.getByText("現在（直近）の経験職種", { exact: true })
  ).toBeHidden();
  await expect(
    loggedInPage.getByText("直近の年収", { exact: true })
  ).toBeHidden();
  await expect(
    loggedInPage.getByText("職務経歴", { exact: true })
  ).toBeHidden();
});

// 会員登録経由では無いので、項目数は絞られない
test("バイト求人への応募内容編集画面", async ({ browser }) => {
  const context = await browser.newContext({ storageState: statePath });
  const loggedInPage = await context.newPage();

  await loggedInPage.goto(applyFormPage, { waitUntil: "load" });

  await loggedInPage.waitForURL(/\/user\/apply\/form/);

  // visible
  await expect(
    loggedInPage.getByText("経験されたお仕事やスキル", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage.getByText("最終学歴", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage.getByText("転職経験", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage.getByText("現在（直近）の経験職種", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage.getByText("直近の年収", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage.getByText("職務経歴", { exact: true })
  ).toBeVisible();
});

test("バイト求人への応募内容確認画面(会員登録経由)", async ({ browser }) => {
  const context = await browser.newContext({ storageState: statePath });
  const loggedInPage = await context.newPage();

  await loggedInPage.goto(applyConfirmInSignUp, { waitUntil: "load" });

  await loggedInPage.waitForURL(/\/user\/apply\/confirm/);

  // visible
  await expect(
    loggedInPage.getByText("経験されたお仕事やスキル", { exact: true })
  ).toBeVisible();

  // hidden
  await expect(
    loggedInPage.getByText("最終学歴", { exact: true })
  ).toBeHidden();
  await expect(
    loggedInPage.getByText("転職経験", { exact: true })
  ).toBeHidden();
  await expect(
    loggedInPage.getByText("現在(直近)の経験職種", { exact: true })
  ).toBeHidden();
  await expect(
    loggedInPage.getByText("直近の年収", { exact: true })
  ).toBeHidden();
  await expect(
    loggedInPage.getByText("職務経歴", { exact: true })
  ).toBeHidden();
});

// 会員登録経由では無いので、項目数は絞られない
test("バイト求人への応募内容確認画面", async ({ browser }) => {
  const context = await browser.newContext({ storageState: statePath });
  const loggedInPage = await context.newPage();

  await loggedInPage.goto(applyConfirm, { waitUntil: "load" });

  // 学歴情報が未登録なのでリダイレクトチェックで引っかかり編集画面へ
  await loggedInPage.waitForURL(/\/user\/apply\/form/);

  // visible
  await expect(
    loggedInPage.getByText("経験されたお仕事やスキル", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage.getByText("最終学歴", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage.getByText("転職経験", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage.getByText("現在（直近）の経験職種", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage.getByText("直近の年収", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage.getByText("職務経歴", { exact: true })
  ).toBeVisible();
});

test("resume", async ({ browser }) => {
  const context = await browser.newContext({ storageState: statePath });
  const loggedInPage = await context.newPage();

  await loggedInPage.goto(resume, { waitUntil: "load" });

  await loggedInPage.waitForURL(/\/user\/setting\/resume/);

  // visible
  await expect(
    loggedInPage.getByText("最終学歴", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage.getByText("転職経験", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage.getByText("現在（直近）の経験職種", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage.getByText("直近の年収", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage.getByText("職務経歴", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage
      .locator(".profileWrap")
      .first()
      .getByText("経験されたお仕事やスキル", { exact: true })
  ).toBeVisible();
});

test("いいね一覧からの一括応募で応募内容編集画面", async ({ browser }) => {
  const context = await browser.newContext({ storageState: statePath });
  const loggedInPage = await context.newPage();

  await loggedInPage.goto(favorite, { waitUntil: "load" });

  await loggedInPage.waitForURL(/\/user\/favorite/);

  await loggedInPage.waitForResponse(/\/user\/favorite\/list/)
  await expect(
    await loggedInPage.getByRole("link", { name: "応募へ進む" })
  ).toHaveCount(3);

  await loggedInPage.getByRole("link", { name: "まとめて応募" }).click();

  // 学歴情報が未登録なのでリダイレクトチェックで引っかかり編集画面へ
  await loggedInPage.waitForURL(/\/user\/apply\/form/);

  // visible
  await expect(
    loggedInPage.getByText("経験されたお仕事やスキル", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage.getByText("最終学歴", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage.getByText("転職経験", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage.getByText("現在（直近）の経験職種", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage.getByText("直近の年収", { exact: true })
  ).toBeVisible();
  await expect(
    loggedInPage.getByText("職務経歴", { exact: true })
  ).toBeVisible();
});
