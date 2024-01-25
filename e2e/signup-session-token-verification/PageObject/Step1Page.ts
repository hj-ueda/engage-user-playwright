import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

export class Step1Page {
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
    await this.page.locator("#user_last_name").fill("あ");
    await this.page.locator("#user_first_name").fill("う");
    await this.page.locator("#user_last_reading").fill("ア");
    await this.page.locator("#user_first_reading").fill("ウ");
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
    await this.page.getByText("次へ（あと2ステップ）").click();
  }

  async checkErrorReport(error: string) {
    await expect(this.page.locator(".errorCopy")).toHaveText(
      "ページを表示できませんでした。"
    );

    const errorHidden = await this.page.locator('input[name="error"]');
    expect(await errorHidden?.getAttribute("value")).toMatch(
      new RegExp(`.+${error}.+`)
    );
  }
}
