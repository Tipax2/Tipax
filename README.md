سامانه مدیریت و گزارش تیپاکس — Tipax Management & Reporting System

سامانه مدیریت، ثبت، پیگیری و گزارش‌گیری اطلاعات شعبه تیپاکس با معماری ماژولار و قابل توسعه.

این پروژه به‌صورت چندفایلی طراحی شده تا هر بخش مستقل باشد و در مراحل بعدی بتوان امکانات، اتصال به API، ورود اطلاعات از Excel، ذخیره‌سازی ابری و در نهایت سرور اختصاصی را بدون بازنویسی کل پروژه توسعه داد.

وضعیت پروژه

ساختار اولیه پروژه شامل بخش‌های زیر است:

صفحه اصلی و معرفی سامانه

ورود به سامانه

داشبورد مدیریتی

مدیریت مرسوله‌ها

ثبت مرسوله

گزارش‌ها

مدیریت انبار

مدیریت پیک‌ها

ورود اطلاعات از Excel/CSV

تنظیمات API

تنظیمات سامانه

مجموعه آیکون‌های SVG

تصاویر و Illustrationهای رابط کاربری

داده‌های نمونه برای تست

قالب‌های خروجی CSV

اطلاعات موجود در data/sample/ ساختگی و صرفاً برای تست و نمایش هستند.

ساختار پروژه

svgTipax/
│
├── index.html
├── login.html
├── dashboard.html
│
├── pages/
│   ├── shipments.html
│   ├── register.html
│   ├── reports.html
│   ├── warehouse.html
│   ├── couriers.html
│   ├── import-excel.html
│   ├── api.html
│   └── settings.html
│
├── css/
│   ├── style.css
│   ├── dashboard.css
│   ├── pages.css
│   └── responsive.css
│
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── dashboard.js
│   ├── shipments.js
│   ├── register.js
│   ├── reports.js
│   ├── warehouse.js
│   ├── couriers.js
│   ├── excel.js
│   ├── api.js
│   └── settings.js
│
├── assets/
│   ├── logo/
│   │   └── tipax-logo.svg
│   │
│   ├── icons/
│   │   ├── ui/
│   │   ├── actions/
│   │   ├── status/
│   │   └── README.md
│   │
│   └── images/
│       ├── illustrations/
│       ├── backgrounds/
│       └── README.md
│
├── data/
│   ├── sample/
│   │   ├── shipments.json
│   │   ├── payments.json
│   │   ├── warehouse.json
│   │   ├── couriers.json
│   │   ├── card-readers.json
│   │   ├── branches.json
│   │   ├── users.json
│   │   ├── shipments.csv
│   │   ├── payments.csv
│   │   ├── warehouse.csv
│   │   ├── couriers.csv
│   │   ├── card-readers.csv
│   │   └── README.md
│   │
│   └── exports/
│       ├── shipments-export.csv
│       ├── payments-export.csv
│       ├── warehouse-export.csv
│       ├── couriers-export.csv
│       ├── card-readers-export.csv
│       ├── daily-report-export.csv
│       ├── export-manifest.json
│       └── README.md
│
└── README.md

بخش‌های اصلی سامانه

1. صفحه اصلی — index.html

صفحه ورودی و معرفی سامانه.

وظایف:

معرفی سامانه

نمایش هویت بصری پروژه

ورود به سامانه

دسترسی به امکانات اصلی

پشتیبانی از حالت روشن و تاریک

رابط کاربری شناور و مدرن

2. ورود — login.html

صفحه احراز هویت اولیه.

این فایل در نسخه فعلی رابط ورود را مدیریت می‌کند و منطق مربوط به احراز هویت در:

js/auth.js

قرار دارد.

در نسخه‌های بعدی می‌توان احراز هویت واقعی را به سرور، Google Apps Script یا Backend اختصاصی منتقل کرد.

3. داشبورد — dashboard.html

مرکز مدیریتی سامانه.

اطلاعات قابل نمایش در داشبورد:

تعداد مرسوله‌ها

مرسوله‌های تحویل‌شده

مرسوله‌های برگشتی

مرسوله‌های در مسیر

مرسوله‌های مختومه

وضعیت درآمد

پرداخت نقدی

پس‌کرایه

تراکنش‌های کارت‌خوان

وضعیت پیک‌ها

وضعیت انبار

خلاصه فعالیت روزانه

منطق داشبورد:

js/dashboard.js

صفحات مدیریتی

4. مدیریت مرسوله‌ها — pages/shipments.html

برای مشاهده، جستجو و مدیریت مرسوله‌ها.

امکانات پیش‌بینی‌شده:

جستجوی کد رهگیری

فیلتر تاریخ

فیلتر وضعیت

فیلتر نوع پرداخت

فیلتر مقصد

نمایش مبلغ

نمایش تعداد بسته

نمایش وزن

نمایش پیک

مشاهده اطلاعات کارت‌خوان

ویرایش اطلاعات

حذف رکورد در سطح مجاز

خروجی گرفتن

منطق:

js/shipments.js

5. ثبت مرسوله — pages/register.html

برای ثبت اطلاعات مرسوله.

اطلاعات قابل ثبت شامل:

کد رهگیری

مشخصات مشتری

مقصد

نوع سرویس

نوع پرداخت

مبلغ

تعداد بسته

وزن

نوع کارتن/بسته

پیک

کارت‌خوان

توضیحات

منطق:

js/register.js

6. گزارش‌ها — pages/reports.html

مرکز گزارش‌گیری سامانه.

گزارش‌ها می‌توانند بر اساس:

تاریخ

شعبه

وضعیت مرسوله

نوع پرداخت

پیک

کارت‌خوان

مقصد

فیلتر شوند.

گزارش‌های موردنظر پروژه شامل:

نقدی

پس‌کرایه

تحویل‌شده

برگشتی

مختومه

در مسیر

عملکرد پیک‌ها

عملکرد کارت‌خوان‌ها

جمع مبالغ

تعداد تراکنش‌ها

سهم هر کارت‌خوان از مجموع

منطق:

js/reports.js

7. انبار — pages/warehouse.html

مدیریت موجودی اقلام شعبه.

نمونه اقلام:

کارتن کوچک

کارتن متوسط

کارتن بزرگ

A3

B4

پاکت

سایر اقلام مصرفی

اطلاعات اصلی:

موجودی اول دوره

ورودی

خروجی

ضایعات

حداقل موجودی

موجودی فعلی

هشدار کمبود

منطق:

js/warehouse.js

8. پیک‌ها — pages/couriers.html

مدیریت و گزارش عملکرد نیروهای تحویل.

برای هر پیک می‌توان اطلاعات زیر را نگهداری کرد:

نام

وسیله نقلیه

شماره تماس

وضعیت فعال

تعداد مرسوله تحویلی

برگشتی

تحویل‌گرفته‌شده

مسیر اشتباه

وضعیت فعالیت روزانه

وسایل نقلیه نمونه:

موتور

وانت

خودرو

منطق:

js/couriers.js

9. ورود Excel/CSV — pages/import-excel.html

این بخش برای زمانی طراحی شده که اطلاعات از API در دسترس نباشد یا کاربر بخواهد فایل اطلاعاتی را وارد سامانه کند.

قابلیت‌های توسعه:

انتخاب فایل

خواندن CSV

پردازش Excel

بررسی Headerها

اعتبارسنجی رکوردها

نمایش Preview

تشخیص خطا

جلوگیری از ورود رکورد ناقص

ثبت اطلاعات معتبر

گزارش خطاهای Import

منطق:

js/excel.js

10. API — pages/api.html

صفحه تنظیمات اتصال به API.

هدف این بخش این است که در صورت وجود API رسمی یا سرویس داده قابل استفاده، اطلاعات مستقیماً وارد سامانه شود و وابستگی به ورود دستی کاهش پیدا کند.

تنظیمات قابل توسعه:

Base URL

Endpoint

API Key

Token

نوع احراز هویت

وضعیت اتصال

تست اتصال

آخرین Sync

زمان‌بندی دریافت اطلاعات

Mapping فیلدها

منطق:

js/api.js

اطلاعات واقعی API نباید در فایل‌های عمومی GitHub Pages یا داخل کد Frontend به‌صورت Secret قرار گیرد. در نسخه سروری، این اطلاعات باید در Backend یا Secret Storage نگهداری شوند.

11. تنظیمات — pages/settings.html

مرکز تنظیمات عمومی سامانه.

موارد قابل توسعه:

اطلاعات شعبه

تنظیمات نمایش

حالت روشن/تاریک

قالب نمایش مبلغ

تنظیمات گزارش

تنظیمات Import

تنظیمات API

تنظیمات پشتیبان‌گیری

اطلاعات سیستم

منطق:

js/settings.js

CSS

css/style.css

استایل پایه و هویت بصری مشترک.

موارد اصلی:

رنگ‌های پروژه

تایپوگرافی

دکمه‌ها

فرم‌ها

کارت‌ها

Glassmorphism

Shadow

Border

Theme variables

اجزای شناور

css/dashboard.css

استایل اختصاصی داشبورد.

css/pages.css

استایل مشترک صفحات داخلی.

css/responsive.css

سازگاری با:

Desktop

Laptop

Tablet

Mobile

JavaScript

js/app.js

منطق عمومی برنامه.

برای موارد مشترک مانند:

Theme

Navigation

Notification

Utility functions

فرمت مبالغ

کنترل‌های عمومی

js/auth.js

منطق احراز هویت و کنترل دسترسی Frontend.

فایل‌های ماژولار JS

dashboard.js
shipments.js
register.js
reports.js
warehouse.js
couriers.js
excel.js
api.js
settings.js

هر فایل مسئول بخش مربوط به خودش است تا پروژه به یک فایل بزرگ و غیرقابل مدیریت تبدیل نشود.

Assets

Logo

assets/logo/tipax-logo.svg

لوگوی اصلی سامانه.

Icons

assets/icons/

آیکون‌ها به سه گروه تقسیم شده‌اند:

ui/
actions/
status/

آیکون‌ها به‌صورت SVG طراحی شده‌اند و از currentColor استفاده می‌کنند تا رنگ آنها از CSS کنترل شود.

Images

assets/images/

شامل:

illustrations/
backgrounds/

تصاویر SVG هستند و برای رابط کاربری و حالت‌های مختلف صفحات استفاده می‌شوند.

Data

data/sample/

داده‌های ساختگی برای تست سامانه.

شامل:

مرسوله

پرداخت

انبار

پیک

کارت‌خوان

شعبه

کاربر

فرمت‌ها:

JSON
CSV

data/exports/

محل قالب‌های خروجی سامانه.

شامل خروجی‌های:

مرسوله

پرداخت

انبار

پیک

کارت‌خوان

گزارش روزانه

فرمت مبالغ

مبالغ در رابط کاربری باید با جداکننده هزارگان نمایش داده شوند.

نمونه:

200,000
1,250,000
12,500,000

ذخیره‌سازی داده بهتر است عددی انجام شود و فقط هنگام نمایش Format شود.

معماری توسعه

پروژه به‌صورت ماژولار طراحی شده است.

HTML
  ↓
CSS
  ↓
JavaScript
  ↓
Data/API
  ↓
Backend / Cloud Storage

در نسخه ابتدایی، صفحات می‌توانند با داده نمونه کار کنند.

در مرحله بعد می‌توان منبع داده را به:

Google Drive / Google Sheets

و سپس به:

Backend + Database + API

منتقل کرد.

Google Drive / Google Sheets

در صورت استفاده از Google Drive، اطلاعات شعبه‌ها نباید در یک فایل مشترک بدون تفکیک منطقی ذخیره شوند.

معماری پیشنهادی آینده:

Storage
│
├── Branch A
│   ├── Shipments
│   ├── Reports
│   ├── Warehouse
│   └── Imports
│
├── Branch B
│   ├── Shipments
│   ├── Reports
│   ├── Warehouse
│   └── Imports
│
└── Branch C
    ├── Shipments
    ├── Reports
    ├── Warehouse
    └── Imports

ایجاد خودکار ساختار شعب در نسخه Backend می‌تواند هنگام ثبت شعبه انجام شود.

چند شعبه و اجاره سامانه

ساختار پروژه از ابتدا با هدف توسعه به حالت چندشعبه‌ای در نظر گرفته شده است.

هر رکورد باید در معماری نهایی یک شناسه شعبه داشته باشد:

branchId

نمونه:

BR-DEMO-001

در نسخه واقعی، کاربر پس از ورود فقط باید اطلاعات شعبه مجاز خودش را دریافت کند.

این موضوع در نسخه GitHub Pages به‌تنهایی امنیت کامل سروری ایجاد نمی‌کند و برای امنیت واقعی باید احراز هویت و کنترل دسترسی در Backend انجام شود.

مسیر توسعه آینده

مرحله 1 — تکمیل رابط کاربری

هماهنگ‌سازی تمام صفحات

اصلاح Responsive

هماهنگ‌سازی Dark/Light

اصلاح Typography

بهبود Floating UI

یکسان‌سازی Components

مرحله 2 — اتصال داده

اتصال JSON/CSV

Import

Export

Validation

مرحله 3 — API

اتصال API

Authentication

Sync

Mapping

Error Handling

مرحله 4 — Cloud Storage

Google Drive

Google Sheets

Backup

Branch isolation

مرحله 5 — Backend

Authentication واقعی

مدیریت کاربران

Branch isolation

Database

API

Logging

Backup

Subscription

مرحله 6 — SaaS

در صورت آماده شدن Backend:

Admin
  ↓
Branches
  ↓
Users
  ↓
Subscriptions
  ↓
Usage
  ↓
Reports

سامانه می‌تواند از یک پروژه نمایشی GitHub Pages به یک نرم‌افزار چندشعبه‌ای قابل ارائه به مشتری تبدیل شود.

GitHub Pages

برای نسخه Frontend می‌توان پروژه را روی GitHub Pages منتشر کرد.

پس از فعال‌سازی Pages، مسیر صفحات بر اساس ساختار Repository خواهد بود.

مثلاً:

/index.html
/login.html
/dashboard.html
/pages/shipments.html
/pages/register.html
...

در زمان انتشار باید مسیرهای نسبی CSS، JavaScript و Assets با ساختار Repository هماهنگ باشند.

نکات مهم امنیتی

GitHub Pages یک محیط Frontend است.

بنابراین موارد زیر نباید مستقیماً در فایل‌های عمومی قرار بگیرند:

Password واقعی

API Secret

Private API Key

Access Token حساس

اطلاعات محرمانه شعب

اطلاعات شخصی مشتریان

برای نسخه واقعی باید این موارد در Backend یا Secret Manager نگهداری شوند.

Backup

برای جلوگیری از از دست رفتن اطلاعات، معماری نهایی باید چند لایه پشتیبان داشته باشد:

Primary Database
       ↓
Automatic Backup
       ↓
Secondary Storage
       ↓
Periodic Export

فایل‌های Export نیز می‌توانند به‌عنوان لایه پشتیبان عملیاتی استفاده شوند.

داده‌های نمونه

تمام اطلاعات داخل:

data/sample/

ساختگی هستند.

این داده‌ها نباید با اطلاعات واقعی مشتریان جایگزین شوند مگر اینکه لایه ذخیره‌سازی و امنیت مناسب برای نسخه واقعی فعال شده باشد.

وضعیت فعلی توسعه

در حال حاضر ساختار اصلی پروژه ایجاد شده و بخش‌های زیر در Repository در نظر گرفته شده‌اند:

HTML
CSS
JavaScript
Assets
Sample Data
Export Templates
README

مرحله بعدی پس از تکمیل ساختار فایل‌ها، تست یکپارچه پروژه است.

در آن مرحله باید ارتباط موارد زیر بررسی شود:

HTML ↔ CSS
HTML ↔ JavaScript
JavaScript ↔ Data
Pages ↔ Navigation
Assets ↔ Pages
Import ↔ Data
Reports ↔ Data
API ↔ Settings

هدف نهایی

هدف پروژه صرفاً یک صفحه نمایشی نیست.

معماری پروژه برای توسعه تدریجی از:

Demo

به:

Working Web Application

و سپس:

Multi-Branch SaaS

در نظر گرفته شده است.

نسخه نهایی می‌تواند شامل:

مدیریت شعب

مدیریت کاربران

مدیریت مرسوله

گزارش مالی

گزارش پیک

مدیریت انبار

کارت‌خوان

Import/Export

API

Backup

Subscription

Dashboard مدیریتی

Backend

Database

احراز هویت واقعی

باشد.

License

این پروژه یک سامانه اختصاصی در حال توسعه است.

استفاده، انتشار یا واگذاری نسخه نهایی باید مطابق شرایط مالک پروژه انجام شود.
