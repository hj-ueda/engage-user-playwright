import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const newEmail = `uuu${Date.now().toString(32)}@mail.com`;
const password = "password";

export class Step2Page {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async checkSignupTokenExists() {
    await expect(
      (await this.page
        .locator('input[name="signup_token"]')
        ?.getAttribute("value")) ?? null
    ).toMatch(/.+/);
  }

  async checkCsrfTokenExists() {
    await expect(
      (await this.page
        .locator('input[name="_token"]')
        ?.getAttribute("value")) ?? null
    ).toMatch(/.+/);
  }

  async fillUserData() {
    await this.page.locator("#login_id").fill(newEmail);
    await this.page.locator("#login_password").fill(password);
  }

  async overwriteSignupToken(token: string) {
    await this.page.evaluate((signupToken) => {
      const signupHiddenEl = document.querySelector(
        'input[name="signup_token"]'
      );
      signupHiddenEl?.setAttribute("value", signupToken ?? "");
    }, token);
  }

  async overwriteCsrfToken(token: string) {
    await this.page.evaluate((csrfToken) => {
      const signupHiddenEl = document.querySelector('input[name="_token"]');
      signupHiddenEl?.setAttribute("value", csrfToken ?? "");
    }, token);
  }

  async post() {
    await this.page.getByText("次へ（あと1ステップ）").click();
  }

  async checkErrorReport(error: string) {
    await expect(this.page.locator(".errorCopy")).toHaveText(
      "ページを表示できませんでした。"
    );

    const errorHidden = await this.page.locator('input[name="error"]');
    await expect(await errorHidden?.getAttribute("value")).toMatch(
      new RegExp(`.+${error}.+`)
    );
  }
}
