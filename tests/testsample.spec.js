// const {
//     test,
//     expect
// } = require('@playwright/test');

// test('Debug in Playwright UI', async ({
//     page
// }) => {
//     await page.goto('https://www.google.com');
//     // await page.pause(); // This pauses execution to inspect the page
//     await expect(page).toHaveTitle(/Google/);
// });




import {test,expect} from '@playwright/test';

test('API Test Debug with Public API', async ({request,page}) => {
    const apiUrl = 'https://dog.ceo/api/breeds/image/random';
    const response = await request.get(apiUrl);
    const data = await response.json();

    console.log('Response Data:', data); // Logs data to the Playwright Inspector

    await page.pause(); // Opens Playwright Inspector


    console.log('Response Data:', data.message); // Logs data to the Playwright Inspector

    await page.pause(); // Opens Playwri
    expect(response.status()).toBe(200);
});