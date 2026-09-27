# Tipax Export Data

این پوشه محل خروجی‌های قابل تولید توسط سامانه است.

## فایل‌های موجود
- `shipments-export.csv` — خروجی مرسوله‌ها
- `payments-export.csv` — خروجی پرداخت‌ها
- `warehouse-export.csv` — خروجی موجودی انبار
- `couriers-export.csv` — خروجی عملکرد پیک‌ها
- `card-readers-export.csv` — خروجی دستگاه‌های کارت‌خوان
- `daily-report-export.csv` — خروجی گزارش روزانه
- `export-manifest.json` — مشخصات خروجی‌ها برای استفاده توسط JavaScript

فایل‌های CSV فعلی فقط Header استاندارد دارند و داده واقعی داخل آن‌ها قرار داده نشده است.
در نسخه اجرایی، `excel.js` و ماژول گزارش‌ها می‌توانند داده‌های واقعی را با همین ستون‌ها تولید کنند.
