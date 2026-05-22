# Сайт центра отдыха «Айтар» (Абхазия)

Лендинг центра отдыха «Айтар» — `aitarabhazia.ru`.
Стек: **React 19 + Vite 7 + TypeScript + Tailwind CSS + shadcn/ui**.
Контент редактируется через **Decap CMS** (данные лежат в JSON в `public/content/`).
Формы заявки и отзыва отправляются через **Web3Forms**.

---

## 1. Требования

- **Node.js 20+** и npm (идёт в комплекте с Node).
- Проверить версию: `node -v`.

## 2. Локальная разработка

```bash
npm install        # установить зависимости (один раз)
npm run dev        # запустить дев-сервер: http://localhost:3000
npm run build      # собрать продакшен-версию в папку dist/
npm run preview    # локально посмотреть собранный dist/
```

- Сайт: `http://localhost:3000/`
- Админка CMS: `http://localhost:3000/admin/`

> Контент берётся из JSON-файлов в `public/content/`. При локальной разработке
> CMS попытается авторизоваться через DecapBridge (см. раздел 4) — для простого
> просмотра контента вход не нужен, JSON читается напрямую.

---

## 3. Структура проекта

```
public/
  admin/         # Decap CMS: config.yml (настройки) и index.html (точка входа)
  content/       # JSON-контент сайта (его и редактирует CMS)
  uploads/       # медиафайлы, загруженные через CMS (media_folder)
  *.jpg          # исходные изображения секций
  .htaccess      # SPA-роутинг для Apache/Beget (копируется в dist/)
  _redirects     # SPA-роутинг для Netlify (на Beget не используется)
src/
  pages/Home.tsx # вся страница (секции, формы заявки и отзыва)
  components/ui/ # компоненты shadcn/ui
vite.config.ts   # конфиг сборки
```

---

## 4. Настройка CMS (Decap + DecapBridge)

Раньше CMS работала на Netlify Identity (`git-gateway`). На Beget это недоступно,
поэтому используется **DecapBridge** — бесплатный сервис-замена. Редактор входит
по **e-mail / Google / Microsoft**, аккаунт GitHub ему **не нужен**.

### Первичная настройка (делается один раз владельцем)

1. Создайте/используйте репозиторий на GitHub (например, `ksneiro4418/aitar-beget`)
   и запушьте в него этот проект (см. раздел 5).
2. Зарегистрируйтесь на **https://decapbridge.com** и нажмите **Create New Site**.
3. Укажите репозиторий в формате `владелец/имя-репозитория`
   (например, `ksneiro4418/aitar-beget`).
4. Сгенерируйте **fine-grained GitHub-токен** с правами на чтение/запись
   (Contents + Pull requests) и привяжите его в DecapBridge.
5. Укажите адрес админки: `https://aitarabhazia.ru/admin/`.
6. DecapBridge выдаст **SITE_ID**. Подставьте его в
   [`public/admin/config.yml`](public/admin/config.yml):
   - `repo:` — ваш репозиторий `владелец/имя`;
   - `identity_url: https://auth.decapbridge.com/sites/ВАШ_SITE_ID`.
7. Закоммитьте и задеплойте изменения. Теперь вход в `/admin/` идёт через DecapBridge.
8. Пригласите редактора (по e-mail) в панели DecapBridge.

> ⚠️ **Важно про обновление сайта.** Когда редактор сохраняет правки в `/admin/`,
> они коммитятся в GitHub, но **живой сайт на Beget не обновится сам** — нужна
> пересборка и повторная заливка. Чтобы это происходило автоматически,
> настройте GitHub Actions (см. раздел 6, вариант В) — тогда правки из CMS будут
> попадать на сайт без ручных действий.

---

## 5. Публикация в GitHub (первый раз)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ksneiro4418/aitar-beget.git
git push -u origin main
```

> `node_modules/`, `dist/` и `*.zip` в репозиторий не попадают (см. `.gitignore`).

---

## 6. Деплой на Beget

Beget — виртуальный хостинг (Apache + nginx). Корень сайта обычно лежит в
`~/<домен>/public_html/` (например, `~/aitarabhazia.ru/public_html/`).

SPA-роутинг уже настроен: файл `public/.htaccess` при сборке копируется в
`dist/.htaccess` и перенаправляет все пути на `index.html`.

### Вариант А — сборка локально, заливка `dist/` (просто и надёжно)

1. Собрать проект локально:
   ```bash
   npm install
   npm run build
   ```
2. Залить **содержимое папки `dist/`** (а не саму папку) в корень сайта
   `public_html/` на Beget:
   - **через FTP** (FileZilla): подключиться по данным из панели Beget,
     перетащить всё из `dist/` в `public_html/`;
   - **через SSH** (rsync):
     ```bash
     rsync -avz --delete dist/ ЛОГИН@ЛОГИН.beget.tech:~/aitarabhazia.ru/public_html/
     ```
3. Открыть `https://aitarabhazia.ru` — готово.

### Вариант Б — сборка на сервере по SSH (если на тарифе включён Node.js)

> На тарифе «Blog» Node.js может быть недоступен. Проверьте `node -v` по SSH;
> если команды нет — используйте вариант А или В.

```bash
ssh ЛОГИН@ЛОГИН.beget.tech
cd ~/aitarabhazia.ru
git clone https://github.com/ksneiro4418/aitar-beget.git src
cd src
npm ci
npm run build
rm -rf ~/aitarabhazia.ru/public_html/*
cp -r dist/. ~/aitarabhazia.ru/public_html/
```

При обновлении: `git pull && npm run build && cp -r dist/. ../public_html/`.

### Вариант В — автодеплой через GitHub Actions (рекомендуется для CMS)

В проекте есть готовый workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
при каждом пуше в `main` (в том числе при сохранении правок из CMS) он собирает
сайт и заливает `dist/` на Beget по FTP.

Чтобы включить, добавьте в GitHub-репозитории
**Settings → Secrets and variables → Actions** четыре секрета (данные из панели Beget):

| Секрет            | Значение                                                  |
|-------------------|-----------------------------------------------------------|
| `FTP_SERVER`      | FTP-хост Beget (например, `ЛОГИН.beget.tech`)              |
| `FTP_USERNAME`    | FTP-логин                                                  |
| `FTP_PASSWORD`    | FTP-пароль                                                 |
| `FTP_SERVER_DIR`  | путь к корню сайта, напр. `/aitarabhazia.ru/public_html/` |

После этого правки из CMS будут попадать на сайт автоматически за пару минут.

---

## 7. Формы (Web3Forms)

Формы заявки и отзыва на главной отправляются через **Web3Forms** (AJAX, без
ухода со страницы — показывается свой экран «успешно отправлено»).

- **Access Key** и тема письма хранятся в
  [`public/content/contact.json`](public/content/contact.json)
  (поля `accessKey` и `subject`) — их можно менять через CMS.
- Письма приходят на e-mail, привязанный к ключу на стороне Web3Forms
  (`aitar.abhazia@mail.ru`). Сменить получателя можно в личном кабинете
  https://web3forms.com по этому ключу.

---

## 8. Редактирование контента

- Через CMS: `https://aitarabhazia.ru/admin/` — удобно для не-технического редактора.
- Вручную: править JSON-файлы в `public/content/` и пересобрать/задеплоить сайт.
