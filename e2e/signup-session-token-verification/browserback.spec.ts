import { test, expect } from "@playwright/test";

const step1Url = "https://engage-u.ueda.c71d/user/signup";

test("STEP2からSTEP1へのブラウザバック時のCookie", async ({page, browser}) => {
	await page.goto(step1Url)
	
	const context = await browser.newContext()
	const cookie = await context.cookies()
	console.log('cookie', cookie)
	await expect(false).toEqual(true)
});
