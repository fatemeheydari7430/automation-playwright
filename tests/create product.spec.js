import {test,expect,request} from '@playwright/test';
import fs from 'fs';      //برای خواندن فایل‌ها از سیستم فایل استفاده می‌شود (در اینجا برای خواندن توکن از فایل auth.json).

test.describe('PRODUCT', async () => {
    let token
    let productId
    let variantId
    let product_variant_id
    let variantId_v
    let product_variant_id_v

    test.beforeEach(async () => {
        const authData = JSON.parse(fs.readFileSync('auth.json', 'utf-8')); //این گزینه مشخص می‌کند که داده‌ها به صورت رشته متنی (string) و با استفاده از کدگذاری UTF-8 خوانده شوند.
        token = authData.token;                                             // JSON.parse(...): داده‌هایی که از فایل به صورت متنی خوانده می‌شوند، باید به فرمت JSON تجزیه (parse) شوند 
    });

    test('create product', async ({request,page}) => {
        const createProductResponse = await request.post('https://stage-api.podro.shop/back4front/v3/merchant/products', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                "name": "p.1",
                "description": "<p>توضیحات تستی</p>",
                "is_active": true,
                "label_ids": [
                    "2cfe2607-d113-439d-98f6-ef49dac358a4"
                ],
                "medias": [{
                        "path": "/podro-staging/companies/1f0f3c7d-cd55-4eeb-987f-33e88cdcb7d1.png",
                        "mime": "image/jpeg",
                        "is_hidden": false
                    },
                    {
                        "path": "/podro-staging/companies/90a5ba01-6913-4848-aaed-7d5c1159e030.png",
                        "mime": "image/jpeg",
                        "is_hidden": false
                    }
                ],
                "product_variants": [{
                        "variant_definition_indexes": [
                            0,
                            2
                        ],
                        "is_active": true,
                        "price": 20000,
                        "price_after_discount": 10000,
                        "quantity": -1,
                        "weight": 5,
                        "unLimitedQuantity": true
                    },
                    {
                        "variant_definition_indexes": [
                            0,
                            3
                        ],
                        "is_active": true,
                        "price": 30000,
                        "price_after_discount": 0,
                        "quantity": 2,
                        "weight": 4,
                        "unLimitedQuantity": false
                    },
                    {
                        "variant_definition_indexes": [
                            1,
                            2
                        ],
                        "is_active": true,
                        "price": 35000,
                        "price_after_discount": 30000,
                        "quantity": 4,
                        "weight": 0,
                        "unLimitedQuantity": false
                    },
                    {
                        "variant_definition_indexes": [
                            1,
                            3
                        ],
                        "is_active": false,
                        "price": 40000,
                        "price_after_discount": 0,
                        "quantity": -1,
                        "weight": 0,
                        "unLimitedQuantity": true
                    }
                ],
                "variant_definitions": [{
                        "key": "رنگ",
                        "value": "red",
                        "index": 0
                    },
                    {
                        "key": "رنگ",
                        "value": "blue",
                        "index": 0
                    },
                    {
                        "key": "سایز",
                        "value": "m",
                        "index": 1
                    },
                    {
                        "key": "سایز",
                        "value": "s",
                        "index": 1
                    }
                ]
            }
        });

        console.log("Response Status create product:", createProductResponse.status());
        await page.pause(); // Opens Playwright Inspector
        expect(createProductResponse.status()).toBe(200);



        // دریافت لیست محصولات
        const listResponse = await request.get('https://stage-api.podro.shop/back4front/v2/merchant/products/list?page_size=50&page=1&unavailable=false&available=false', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        expect(listResponse.status()).toBe(200);

        const listData = await listResponse.json();
        console.log("listResponse:", listData);
        await page.pause(); // Opens Playwright Inspector

        productId = listData.products.items[0].id;

    });

    test('read product', async ({ request, page }) => {

        const response = await request.get(`https://stage-api.podro.shop/back4front/v3/merchant/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    
        console.log("Response Status read product:", response.status());
        await page.pause(); // باز کردن Playwright Inspector
    
        expect(response.status()).toBe(200);
    });
 
    test('update product', async ({ request, page }) => {
        const updateResponse = await request.patch(`https://stage-api.podro.shop/back4front/v3/merchant/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                "name": "p.update.1",
                "description": "<p>توضیحات تستی</p>",
                "is_active": true,
                "media_items": [
                    {
                        "path": "/podro-staging/companies/90a5ba01-6913-4848-aaed-7d5c1159e030.png",
                        "mime": "image/jpeg"
                    },
                    {
                        "path": "/podro-staging/companies/7cbb92b9-83ed-4e54-b30d-b34efeff677e.png",
                        "mime": "image/jpeg"
                    }
                ],
                "label_ids": []
            }
        });
        
        console.log("Response Status updateResponse:", updateResponse.status());
        await page.pause(); // باز کردن Playwright Inspector
    
        expect(updateResponse.status()).toBe(200);
    
        // دریافت اطلاعات محصول پس از بروزرسانی
        const getResponse = await request.get(`https://stage-api.podro.shop/back4front/v3/merchant/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    
        console.log("Response Status getResponse:", getResponse.status());
        await page.pause(); // باز کردن Playwright Inspector

        expect(getResponse.status()).toBe(200);
    
        // استخراج variantId از پاسخ
        const responseBody = await getResponse.json();
        variantId = responseBody.data.variants_group_by_key[0].variants;
    });

     test('update variants (T)', async ({ request, page }) => {

        // حذف یک واریانت از محصول
        const deleteResponse = await request.delete(
            `https://stage-api.podro.shop/back4front/v3/merchant/products/${productId}/variants?ids=${variantId[0].id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("Response Status deleteResponse:", deleteResponse.status());
        await page.pause(); // باز کردن Playwright Inspector

        expect(deleteResponse.status()).toBe(200);

        // اضافه کردن واریانت جدید
        const addVariantResponse = await request.post(
            `https://stage-api.podro.shop/back4front/v3/merchant/products/${productId}/variants`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    "variants": [
                        {
                            "key": "رنگ",
                            "value": "yellow"
                        }
                    ]
                }
            }
        );

        console.log("Response Status addVariantResponse:", addVariantResponse.status());
        await page.pause(); // باز کردن Playwright Inspector
        
        expect(addVariantResponse.status()).toBe(200);

        // دریافت اطلاعات محصول
        const productResponse = await request.get(
            `https://stage-api.podro.shop/back4front/v3/merchant/products/${productId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("Response Status productResponse:", productResponse.status());
        await page.pause(); // باز کردن Playwright Inspector

        expect(productResponse.status()).toBe(200);

        const productData = await productResponse.json();
        product_variant_id = productData.data.product_variants;

        // بروزرسانی واریانت‌های محصول
        const updateVariantsResponse = await request.put(
            `https://stage-api.podro.shop/back4front/v3/merchant/products/${productId}/variants`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    "variants": [
                        {
                            "product_variant_id": product_variant_id[0].id,
                            "price": 35000,
                            "price_after_discount": 30000,
                            "quantity": 4,
                            "weight": 0,
                            "is_active": true
                        },
                        {
                            "product_variant_id": product_variant_id[1].id,
                            "price": 40000,
                            "price_after_discount": 0,
                            "quantity": -1,
                            "weight": 0,
                            "is_active": false
                        },
                        {
                            "product_variant_id": product_variant_id[2].id,
                            "price": 27000,
                            "price_after_discount": 0,
                            "quantity": -1,
                            "weight": 0,
                            "is_active": true
                        },
                        {
                            "product_variant_id": product_variant_id[3].id,
                            "price": 62000,
                            "price_after_discount": 0,
                            "quantity": -1,
                            "weight": 0,
                            "is_active": true
                        }
                    ]
                }
            }
        );

        console.log("Response Status updateVariantsResponse:", updateVariantsResponse.status());
        await page.pause(); // باز کردن Playwright Inspector

        expect(updateVariantsResponse.status()).toBe(200);
    });

    test('update variants(v)', async ({ request, page }) => {

        // درخواست GET برای دریافت اطلاعات محصول
        const getProductResponse = await request.get(`https://stage-api.podro.shop/back4front/v3/merchant/products/${productId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    
        console.log("Response Status getProductResponse:", getProductResponse.status());
        await page.pause(); // باز کردن Playwright Inspector
    
        expect(getProductResponse.status()).toBe(200);
        
        const productData = await getProductResponse.json();
        variantId_v = productData.data.variants_group_by_key;
    
        // درخواست DELETE برای حذف برخی از واریانت‌ها
        const deleteResponse = await request.delete(`https://stage-api.podro.shop/back4front/v3/merchant/products/${productId}/variants?ids=${variantId_v[1].variants[0].id},${variantId_v[1].variants[1].id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    
        console.log("Response Status deleteResponse:", deleteResponse.status());
        await page.pause(); // باز کردن Playwright Inspector
    
        expect(deleteResponse.status()).toBe(200);
    
        // درخواست POST برای اضافه کردن واریانت‌های جدید
        const postResponse = await request.post(`https://stage-api.podro.shop/back4front/v3/merchant/products/${productId}/variants`, {
            headers: { Authorization: `Bearer ${token}` },
            data: {
                "variants": [
                    { "key": "رنگ", "value": "blue" },
                    { "key": "رنگ", "value": "yellow" },
                    { "key": "جنس", "value": "نخی" },
                    { "key": "جنس", "value": "کتان" }
                ]
            }
        });
    
        console.log("Response Status postResponse:", postResponse.status());
        await page.pause(); // باز کردن Playwright Inspector
    
        expect(postResponse.status()).toBe(200);
    
        // دریافت اطلاعات جدید محصول
        const getUpdatedProductResponse = await request.get(`https://stage-api.podro.shop/back4front/v3/merchant/products/${productId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    
        console.log("Response Status getUpdatedProductResponse:", getUpdatedProductResponse.status());
        await page.pause(); // باز کردن Playwright Inspector
        
        expect(getUpdatedProductResponse.status()).toBe(200);
    
        const updatedProductData = await getUpdatedProductResponse.json();
        product_variant_id_v = updatedProductData.data.product_variants;
    
        // درخواست PUT برای به‌روزرسانی واریانت‌ها
        const putResponse = await request.put(`https://stage-api.podro.shop/back4front/v3/merchant/products/${productId}/variants`, {
            headers: { Authorization: `Bearer ${token}` },
            data: {
                "variants": [
                    { "product_variant_id": product_variant_id_v[0].id, "price": 10000, "price_after_discount": 0, "quantity": -1, "weight": 0, "is_active": true },
                    { "product_variant_id": product_variant_id_v[1].id, "price": 20000, "price_after_discount": 0, "quantity": -1, "weight": 0, "is_active": true },
                    { "product_variant_id": product_variant_id_v[2].id, "price": 30000, "price_after_discount": 0, "quantity": -1, "weight": 0, "is_active": true },
                    { "product_variant_id": product_variant_id_v[3].id, "price": 40000, "price_after_discount": 0, "quantity": -1, "weight": 0, "is_active": true }
                ]
            }
        });
        expect(putResponse.status()).toBe(200);
    });
    
    test('delete product', async ({ request, page }) => {
        // ارسال درخواست DELETE با API داخلی Playwright
        const deleteProduct = await request.delete(`https://stage-api.podro.shop/back4front/scms/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    
        console.log("Response Status deleteProduct:", deleteProduct.status());
        await page.pause(); // باز کردن Playwright Inspector

        expect(deleteProduct.status()).toBe(204);
    });


});
