import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

export class OtpPage {
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

  async fillOtpCode(dummyOtp) {
    await this.page.locator('input[name="otp"]').fill(dummyOtp);
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
    await this.page.getByText("認証して、次に進む").click();
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
