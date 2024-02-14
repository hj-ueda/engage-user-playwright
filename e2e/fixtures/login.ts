import { expect, chromium } from "@playwright/test";

export async function login(
  loginId: string,
  password: string,
  statePath: string
) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let sessionAlive = false;
  try {
    const context = await browser.newContext({ storageState: statePath });
    const cookies = await context.cookies();
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      if (cookies[i].name === "R16U99") {
        const expires = cookies[i].expires;
        if (Date.now() + 60 * 60 > cookies[i].expires) {
          sessionAlive = true;
          break;
        }
      }
    }
  } catch (error) {
    // statePathにファイルが存在していない場合
  }

  if (!sessionAlive) {
    await page.goto("/user/login");

    await page.locator("#login_id").fill(loginId);
    await page.locator("#login_password").fill(password);

    await page.getByText("ログインする", { exact: true }).click();

    await expect(page).toHaveURL(/\/user\/[^login]+/, { timeout: 100000 });
    await page.context().storageState({ path: statePath });
  }
}
