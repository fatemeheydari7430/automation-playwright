import {test,expect,request} from '@playwright/test';
import fs from 'fs';      //برای خواندن فایل‌ها از سیستم فایل استفاده می‌شود (در اینجا برای خواندن توکن از فایل auth.json).

test.describe('ORDER', () => {
  let token
  let productId;
  let product_variant_id;
  let variant_id;

  test.beforeEach(async () => {
      const authData = JSON.parse(fs.readFileSync('auth.json', 'utf-8')); //این گزینه مشخص می‌کند که داده‌ها به صورت رشته متنی (string) و با استفاده از کدگذاری UTF-8 خوانده شوند.
      token = authData.token;                                             // JSON.parse(...): داده‌هایی که از فایل به صورت متنی خوانده می‌شوند، باید به فرمت JSON تجزیه (parse) شوند 
  });

  test('create product', async ({request,page}) => {

    const response = await request.post('https://stage-api.podro.shop/back4front/scms/products', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        "vitrine_id": variant_id,
        "description": "",
        "name": "order",
        "is_active": true,
        "price": 10000,
        "price_after_discount": 0,
        "total_cost": 0,
        "media": [],
        "variant_list": {},
        "weight": 0,
        "kind": "PHYSICAL",
      }
    });

    console.log("Response Status create product:", response.status());
    await page.pause(); // باز کردن Playwright Inspector

    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    productId = responseBody.product_variants[0].product_id;
    product_variant_id = responseBody.product_variants[0].id;
    variant_id = responseBody.product_variants[0].shop_id;
  });

  test('Manual order', async ({request,page}) => {

    const response = await request.post('https://stage-api.podro.shop/back4front/scms/baskets', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        "company_id": variant_id,
        "items": [{
          "count": 1,
          "id": productId,
          "name": "order",
          "title": "order",
          "note": "",
          "product_id": productId,
          "product_variant_id": product_variant_id,
          "selected_variant": {
            "id": product_variant_id,
            "price": 10000,
            "price_after_discount": 0,
            "quantity": 0,
            "unlimited_quantity": true,
            "remaining_quantity": null,
            "variants": null
          }
        }],
        "recipient": {
          "full_name": "فاطمه  حیدری",
          "first_name": "فاطمه ",
          "last_name": "حیدری",
          "province": "b2b718f7-8adb-4282-a409-a8afc9d6c9a3",
          "city_code": "2301",
          "address": "۱",
          "mobile": "09155307430",
          "postal_code": "4444444444",
          "location": null,
          "unit": "۳",
          "no": "2"
        }
      }
    });

    console.log("Response Status Manual order:", response.status());
    await page.pause(); // باز کردن Playwright Inspector

    expect(response.status()).toBe(201);
  });
  
});
