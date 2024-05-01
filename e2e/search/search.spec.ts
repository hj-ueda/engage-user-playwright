import { test, expect } from "@playwright/test";
import path from "path";
import { STORAGE_STATE_DIR } from "@/playwright.config";

test.describe("検索画面", () => {
  test("企業名を指定した検索", async ({ page }) => {
    const path =
      "/user/search/?from=top&keyword=&companyName=きぎょう&salary_0=0&span=0&PK=&token=6631d504415f1&area=5&job=&distanceIndex=&wish_no=#/";
    await page.goto(path);
    await page.waitForLoadState("load");

    const searchFormArea = await page.locator("#searchFormArea");

    await expect(searchFormArea.locator(".form.form--kodawari")).toContainText(
      "きぎょう"
    );

    // フィルタボタンの確認
    // const modalButton = await searchFormArea
    //   .locator(".tagBtn")
    // 	.nth(6)
    //   .getByText("きぎょう", { exact: false });
    const modalButton = await page.locator(
      ".kodawariFormWrap > .kodawariScrollArea > .tagSet > div:nth-child(6)"
    );
    await expect(modalButton).toBeVisible();

    await modalButton.click();
    // モーダル
    const modal = await page.locator(".md_modal--kodawariList");
    // モーダルタイトル
    await expect(
      modal.getByText("企業名を指定", { exact: true })
    ).toBeVisible();
    // 入力欄
    await expect(
      modal.getByPlaceholder("企業名を入力", { exact: true })
    ).toBeVisible();

    await expect(
      modal.getByPlaceholder("企業名を入力", { exact: true })
    ).toHaveValue("きぎょう");

    await modal.getByText("リセット", { exact: false }).click();
    await expect(
      modal.getByPlaceholder("企業名を入力", { exact: true })
    ).not.toHaveValue("きぎょう");

    // モーダルを閉じる
    await modal.locator(".closeLink").click();
    await expect(
      modal.getByText("企業名を指定", { exact: true })
    ).not.toBeVisible();

    /** バツボタンが押せない */
    // await page.locator('.kodawariFormWrap .closeLink').click({ timeout: 10 })
    // // 企業名を省いた検索
    // await page.waitForLoadState('load')
    // // await page.getByRole('link', { name: crossString })
    // const expression = 'company_name=' + encodeURIComponent('きぎょう')
    // await expect(page).not.toHaveURL(new RegExp(expression), { timeout: 10 })
  });
});
