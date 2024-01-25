import { test, expect } from "@playwright/test";

const descUrl = "https://engage-u.ueda.c71d/user/search/desc/366/?aroute=1101";
// const descUrl = "https://en-gage.net/user/search/desc/4116414?aroute=1105&PK=6E858D#/";

// const recommendApiUri = "https://engage-u.ueda.c71d/user/api/work_recommend/work_detail/";
const recommendApiUri = "https://en-gage.net/user/api/work_recommend/work_detail/*";


const karte = "https://b.karte.io/event"

test("work_id:366の静的求人詳細 VRT", async ({ page }) => {
  await page.goto(descUrl);

	// page.route(karte, async (route) => {
	// 	route.fulfill({
	// 		status: 200,
	// 		contentType: 'application/json',
	// 		// body: JSON.stringify({"result":0,"list":[],"spec":"pc311","rqid":"12345"})
	// 		body: JSON.stringify({
	// 			"events_id": "1697784335441_GS5at8",
	// 			"done": true,
	// 			"actions": [],
	// 			"system_error_actions": [],
	// 			"error": null,
	// 			"segment_ids": null
	// 		})
	// 	})
	// })
  // await page.waitForRequest(
  //   (response) => {
  //     console.log("response.url()", response.url());
  //     return response.url().includes(recommendApiUri);
  //   },
  //   { timeout: 60 * 10000 }
  // );

  await expect(page).toHaveScreenshot({ fullPage: true });
});
