import {
    test,
    expect
} from '@playwright/test';

test('افزودن محصولات به سبد خرید', async ({
    page
}) => {
    // باز کردن صفحه مورد نظر با افزایش تایم‌اوت
    await page.goto('https://stage.podro.shop/test.reward.1', {
        timeout: 60000
    }); // افزایش تایم‌اوت به 60 ثانیه

    // فرض بر این است که نام محصولات مختلف باشد. به این ترتیب باید تمامی نام‌های محصول را لیست کنیم.
    const productNames = [
        "محصول اول", // این را با نام‌های واقعی محصولات خود جایگزین کنید
        "محصول دوم",
        "محصول سوم"
    ];

    // برای هر نام محصول، دکمه افزودن به سبد خرید را پیدا کرده و روی آن کلیک می‌کنیم
    for (let i = 0; i < productNames.length; i++) {
        const productName = productNames[i];

        // پیدا کردن محصول بر اساس متن (نام محصول)
        const productLocator = page.locator(`text=${productName}`);

        // // استفاده از waitForSelector برای اطمینان از اینکه محصول در دسترس است
        // await productLocator.waitFor({
        //     state: 'visible',
        //     timeout: 10000
        // }); // 10 ثانیه زمان انتظار برای دیدن محصول

        // // بررسی اینکه محصول پیدا شده است یا خیر
        // await expect(productLocator).toBeVisible();

        // کلیک بر روی محصول برای رفتن به صفحه جزئیات آن
        await productLocator.click();

        // فرض بر این که دکمه افزودن به سبد خرید در صفحه جزئیات محصول است
        const addToCartButton = await page.locator('button:has-text("افزودن به سبد خرید")'); // دکمه افزودن به سبد خرید را پیدا می‌کنیم

        // // استفاده از waitForElementState برای اطمینان از اینکه دکمه به DOM متصل است
        // await addToCartButton.waitForElementState('attached', {
        //     timeout: 10000
        // }); // افزایش زمان انتظار به 10 ثانیه

        // کلیک روی دکمه افزودن به سبد خرید
        await addToCartButton.click();
        // console.log(`محصول "${productName}" به سبد خرید اضافه شد.`);

        // برگشت به صفحه قبلی برای ادامه فرایند
        // await page.goBack();
        await page.goto('https://stage.podro.shop/test.reward.1');
    }

    // // بررسی تعداد محصولات در سبد خرید
    // const cartCount = await page.locator('.css-1iz3ztt'); // انتخاب‌گر مربوط به تعداد آیتم‌های سبد خرید
    // const countText = await cartCount.textContent();
    // // console.log(`تعداد محصولات در سبد خرید: ${countText}`);
    // expect(countText).toContain(`${productNames.length}`);


// انتخاب همه آیتم‌های سبد خرید بر اساس کلاس یا شناسه مربوطه
const cartItems = await page.locator('.css-1iz3ztt'); // این انتخاب‌گر را مطابق پروژه خود تغییر بده

// شمارش تعداد آیتم‌های موجود در سبد خرید
const itemCount = await cartItems.count();

// بررسی اینکه تعداد آیتم‌های سبد خرید برابر با تعداد محصولات اضافه‌شده باشد
expect(itemCount).toBe(productNames.length);


});


