import {test,expect} from '@playwright/test';

test('Add products to cart', async ({page}) => {

    await page.goto('https://stage.podro.shop/test.reward.1');

    const productNames = [
        "p-1", 
        "p-2",
        "p-3"
    ];

    for (let i = 0; i < productNames.length; i++) {
        const productName = productNames[i];

        await page.locator(`text=${productName}`).click();
        await page.locator('button:has-text("افزودن به سبد خرید")').click();

        console.log(productName);
        await page.goto('https://stage.podro.shop/test.reward.1');
    }

    const countText = await page.locator('.css-1iz3ztt').textContent();

    console.log(`Number of products in the shopping cart: ${countText}`);
    expect(countText).toContain(`${productNames.length}`);

});


