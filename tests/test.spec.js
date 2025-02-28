import {test,expect} from '@playwright/test';



test('sample test', async ({page}) => {
    await page.goto('https://www.google.com');
    await page.locator('textarea[name="q"]').fill('Playwright');   // نوشتن "Playwright" در کادر جستجو
    await page.keyboard.press('Enter');    // زدن کلید Enter
    await page.waitForTimeout(2000);    // صبر کردن تا نتایج جستجو لود بشه
    await expect(page).toHaveURL(/search/);    // بررسی اینکه URL تغییر کرده و شامل "search" هست
});


test('جستجو در ویکی‌پدیا', async ({page}) => {
    await page.goto('https://en.wikipedia.org/'); // باز کردن ویکی‌پدیای انگلیسی
    await page.locator('#searchInput').fill('Playwright'); // تایپ "Playwright"
    await page.keyboard.press('Enter'); // زدن Enter
    await page.waitForURL(/Playwright/); // صبر می‌کنیم تا URL تغییر کنه
    await expect(page).toHaveURL(/Playwright/); // چک می‌کنیم که URL درست باشه
    await page.screenshot({path: 'google.png',fullPage: true}); // گرفتن عکس از کل صفحه
});