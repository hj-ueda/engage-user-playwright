import { test, expect } from "@playwright/test";

// const path = "#/allform/list/posted";

test.describe("こだわり条件フォームに企業名の入力欄を設ける", () => {
  test("企業名の入力欄が存在する", async ({ page }) => {
    await page.goto("/user");
    await page.waitForLoadState("load");
    
    page.on('dialog', async (dialog) => {
      const message = dialog.message()
      console.log('message', message)
      dialog.accept()
    })

    await page
      .getByRole("link", { name: "職種、給与など、こだわりは？" })
      .click();

    const companyNameInput = await page.getByPlaceholder("企業名を入力", {
      exact: true,
    });
    await expect(page.getByText("フリーワード", { exact: true })).toBeVisible();
    await expect(
      page.getByPlaceholder("職種、キーワードなどを入力", { exact: true })
    ).toBeVisible();
    await expect(page.getByText("企業名", { exact: true })).toBeVisible();
    await expect(companyNameInput).toBeVisible();

    // 企業名入力
    await companyNameInput.fill("きぎょう");

    // 勤務地入力
    await page
      .getByRole("cell", { name: "都道府県、市区町村、駅名 選択" })
      .getByRole("link", { name: "選択" })
      .click();

    await page.locator("a").filter({ hasText: "関西" }).click();
    await page.getByText("関西すべて", { exact: true }).click();
    await page.locator("a").filter({ hasText: "この条件で探す" }).click();

    await page.waitForLoadState("load");
    
    await expect(page).toHaveURL(/\/user\/search/, { timeout: 10 })
    
    const expression = 'company_name=' + encodeURIComponent('きぎょう')
    await expect(page).toHaveURL(new RegExp(expression), { timeout: 10 })
    // await expect(page).toHaveURL(//, { timeout: 10 })
    // await expect(page).toHaveURL(//, { timeout: 10 })
  });
  
  test("検索後のこだわり条件フォーム", async ({ page }) => {
    const path =
      "/user/search/?from=top&keyword=&companyName=きぎょう&salary_0=0&span=0&PK=&token=6631d504415f1&area=5&job=&distanceIndex=&wish_no=#/allform/list/posted";
    await page.goto(path);
    await page.waitForLoadState("load");
		
    const companyNameInput = await page.getByPlaceholder("企業名を入力", {
      exact: true,
    });
    await expect(companyNameInput).toHaveValue('きぎょう', { timeout: 10})
    
    await page.getByText('リセット', { exact: false }).click()
    await expect(companyNameInput).not.toHaveValue('きぎょう', { timeout: 10})
  });
});
