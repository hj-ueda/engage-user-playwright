import { test, expect } from "@playwright/test";

import { positivePatterns, negativePatterns } from "./patterns/token-patterns";
import { Step1Page } from "./PageObject/Step1Page";
import { Step2Page } from "./PageObject/Step2Page";
import { OtpPage } from "./PageObject/OtpPage";

const step1Url = "https://engage-u.ueda.c71d/user/signup";

const dummyOtp = "123456";

[...positivePatterns, ...negativePatterns].forEach((pattern) => {
  test(pattern.title, async ({ page }, testInfo) => {
    if (pattern.timeout !== undefined) {
      // 正常系は処理が最後まで行くのでタイムアウトしないように
      test.setTimeout(pattern.timeout);
    }
    console.log("pattern", pattern);

    // STEP1 ==============================================
    await page.goto(step1Url);

    const step1Page = new Step1Page(page);
    // signup_token
    await step1Page.checkSignupTokenExists();

    // _token
    await step1Page.checkCsrfTokenExists();

    // input
    await step1Page.fillUserData();

    if (!pattern.step1.through) {
      if (pattern.step1.signup_token !== undefined) {
        // signup_tokenの書き替え
        await step1Page.overwriteSignupToken(pattern.step1.signup_token);
      }

      if (pattern.step1._token !== undefined) {
        // _tokenの書き替え
        await step1Page.overwriteCsrfToken(pattern.step1._token);
      }
    }

    // [click:submit] POST
    await step1Page.post();

    if (pattern.step1.errorContains !== undefined) {
      await step1Page.checkErrorReport(pattern.step1.errorContains);

      // // [assertion] エラー文のチェック
      return;
    }

    // STEP2 ==============================================

    // [assertion] urlチェック
    await expect(page).toHaveURL(/\/user\/signup\/step2/);

    const step2Page = new Step2Page(page);
    // [assertion] hiddenのsignup_tokenの有無
    await step2Page.checkSignupTokenExists();

    // [assertion] hiddenの_tokenの有無
    await step2Page.checkCsrfTokenExists();

    // [type] メールアドレスとパスワードの入力
    await step2Page.fillUserData();

    if (pattern.step2 && !pattern.step2.through) {
      if (pattern.step2.signup_token !== undefined) {
        // signup_tokenの書き替え
        await step2Page.overwriteSignupToken(pattern.step2.signup_token);
      }

      if (pattern.step2._token !== undefined) {
        // _tokenの書き替え
        await step2Page.overwriteCsrfToken(pattern.step2._token);
      }
    }

    // [click:submit] POST
    await step2Page.post();

    if (pattern.step2?.errorContains !== undefined) {
      await step2Page.checkErrorReport(pattern.step2.errorContains);
      return;
    }

    // OTP認証 ==============================================
    const otpPage = new OtpPage(page);

    // [assertion] urlチェック
    await expect(page).toHaveURL(/\/user\/signup\/otp_authorization/);

    // [assertion] hiddenのsignup_tokenの有無
    await otpPage.checkSignupTokenExists();

    // [assertion] hiddenの_tokenの有無
    await otpPage.checkCsrfTokenExists();

    // [type] otpの入力
    await otpPage.fillOtpCode(dummyOtp);

    if (pattern.otp && !pattern.otp.through) {
      if (pattern.otp.signup_token !== undefined) {
        // signup_tokenの書き替え
        await otpPage.overwriteSignupToken(pattern.otp.signup_token);
      }

      if (pattern.otp._token !== undefined) {
        // _tokenの書き替え
        await otpPage.overwriteCsrfToken(pattern.otp._token);
      }
    }

    // [click:submit] POST
    await otpPage.post();
    // await page.getByText("認証して、次に進む").click();

    if (pattern.otp?.errorContains !== undefined) {
      otpPage.checkErrorReport(pattern.otp.errorContains);
      return;
    }

    // OTP認証 (エラー) ==============================================

    // [assertion] エラー文のチェック
    await expect(
      page.locator(
        "#mainForm > div > div.md_card.md_card--attentionNav > div.cardContent > div.contentArea > ul.errorList > li.error"
      )
    ).toHaveText("正しい認証コードを入力ください。");

    // [assertion] hiddenのsignup_tokenの有無
    await expect(
      (await page
        .locator('input[name="signup_token"]')
        ?.getAttribute("value")) ?? null
    ).toMatch(/.+/);

    // [assertion] hiddenの_tokenの有無
    await expect(
      (await page.locator('input[name="_token"]')?.getAttribute("value")) ??
        null
    ).toMatch(/.+/);
  });
});
