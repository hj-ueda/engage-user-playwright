import { test, expect } from "@playwright/test";
import path from "path";
import { STORAGE_STATE_DIR } from "@/playwright.config";
import { login } from "@/e2e/fixtures/login";

const statePath = path.join(STORAGE_STATE_DIR, "user-uuu89.json");

test.beforeAll("login", async () => {
  await login("uuu89@g.com", "password", statePath);
});

test.describe("こだわり条件フィルタ", () => {
  test("企業名のモーダルを開くボタン PC", async ({ browser }) => {
    const context = await browser.newContext({ storageState: statePath });
    const page = await context.newPage();
    const path = "/user";
    await page.goto(path);
    await page.waitForLoadState("load");

    const searchFormArea = await page.locator("#searchFormArea");

    // フィルタボタンの確認
    await expect(searchFormArea).toBeVisible();
    const modalButton = searchFormArea
      .locator(".spHide")
      .getByText("企業名", { exact: false });
    await expect(modalButton).toBeVisible();

    const initialCountResponsePromise = page.waitForResponse(/total-count/);
    await modalButton.click();

    // モーダル
    const modal = await page.locator(".md_modal--kodawariList");
    // モーダルタイトル
    await expect(
      modal.getByText("企業名を指定", { exact: true })
    ).toBeVisible();
    // 入力欄
    const inputELement = modal.getByPlaceholder("企業名を入力", {
      exact: true,
    });
    await expect(inputELement).toBeVisible();
    // 最初のリアルタイム検索が終わるのを待つ
    await initialCountResponsePromise;

    const initialCount = await modal.locator(".count .num").textContent();
    const value = "株式会社かいしゃ";
    // const totalCountRequestPromise = page.waitForRequest(/total-count/)
    const totalCountResponsePromise = page.waitForResponse(/total-count/);
    await inputELement.fill(value);
    // const totalCountRequest = await totalCountRequestPromise
    const totalCountResponse = await totalCountResponsePromise;

    await expect(totalCountResponse.request().method()).toEqual("POST");
    await expect(totalCountResponse.request().postDataJSON()).toEqual(
      expect.objectContaining({ companyName: value })
    );

    const responseData = await totalCountResponse.json();
    await expect(responseData).toEqual(
      expect.objectContaining({ count: expect.any(Number) })
    );
    const newCount = responseData.count;

    const updatedCount = await page.locator(".count .num").textContent();
    await expect(updatedCount).toEqual(String(newCount));

    await page
      .getByRole("link", { name: "この条件で探す", exact: false })
      .click();
    // await modal.getByRole("link", { name: "リセット", exact: false }).click()
    // await expect(await inputELement.inputValue()).toEqual('')

    // await page.getByRole('link', { name: "\ea12" })
  });

  test("企業名のモーダルを開くボタン SP", async ({ browser }) => {
    // 準備
    const context = await browser.newContext({ storageState: statePath });
    const page = await context.newPage();
    page.setViewportSize({ width: 800, height: 521 });
    const path = "/user";
    await page.goto(path);
    await page.waitForLoadState("load");

    const searchFormArea = await page.locator("#searchFormArea");

    // フィルタボタンの確認
    await expect(searchFormArea).toBeVisible();
    const modalButton = searchFormArea
      .locator(".formArea--kodawari")
      .getByText("企業名", { exact: false });
    await expect(modalButton).toBeVisible();

    await modalButton.click();
  });
});
