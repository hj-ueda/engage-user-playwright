import { test, expect, chromium } from "@playwright/test";
import path from "path";
import { STORAGE_STATE_DIR } from "./../../../playwright.config";

const resume = "/user/setting/resume";

const statePath = path.join(STORAGE_STATE_DIR, 'user-uuu82.json')

const loginIdPatterns = {
  // 職務経歴未登録
  noCareerDetailData: 'uuu82@g.com'
}
test.beforeAll("login", async () => {
  console.log('before each')
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  await page.goto("/user/login");
  const loginId = loginIdPatterns.noCareerDetailData;
  const password = "password";

  await page.locator("#login_id").fill(loginId);
  await page.locator("#login_password").fill(password);

  await page.getByText("ログインする").click();
  
  await expect(page).toHaveURL(/\/user\/[^login]+/, { timeout: 100000 })
  await page.context().storageState({ path: statePath });
});

test("resume 1", async ({ browser }) => {  
  const context = await browser.newContext({ storageState: statePath });
  const page = await context.newPage()
  
  await page.goto(resume, { waitUntil: 'load' })
  await page.waitForLoadState('load')
  await page.waitForURL(/user\/setting\/resume/, { timeout: 120000 })
  await expect(page.getByRole('button', { name: '+生成AIで作成する' }).first()).toBeVisible()
  
  await context.close()
});
