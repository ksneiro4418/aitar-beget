<?php
/**
 * Схема контента для админки «Айтар» — 1:1 со старым Decap config.yml.
 * Каждая коллекция = один JSON-файл в /content. Поля описывают форму редактирования.
 *
 * Типы виджетов (widget):
 *   string   — короткая строка (input)
 *   text     — многострочный текст (textarea)
 *   number   — число (min/max опционально)
 *   boolean  — да/нет (checkbox)
 *   select   — выбор из списка (options)
 *   image    — картинка (загрузка в /uploads, хранится путь)
 *   object   — вложенный объект (fields)
 *   list     — список: либо повторяющихся объектов (fields), либо простых значений (field)
 */

$ICONS = ['Palmtree','Shield','Heart','Sunrise','Mountain','Star','Waves','Music','Trophy','Utensils','MapPin','Mail','Phone','Bed','CheckCircle','Bus','CreditCard','Users','Calendar','Baby','Plane'];

return [
  'header' => [
    'label' => '🧭 Шапка сайта (меню)',
    'file'  => 'header.json',
    // seed — значения по умолчанию: показываются в CMS, если файла ещё нет на сервере
    'seed'  => [
      'logo' => 'Айтар',
      'cta'  => 'Оставить заявку',
      'nav'  => [
        ['href'=>'#about','label'=>'О лагере'],
        ['href'=>'#pricing','label'=>'Цены и смены'],
        ['href'=>'#accommodation','label'=>'Проживание'],
        ['href'=>'#activities','label'=>'Развлечения'],
        ['href'=>'#dance','label'=>'Танцевальный интенсив'],
        ['href'=>'#sports-camps','label'=>'Спортивные сборы'],
        ['href'=>'#transfer','label'=>'Трансфер'],
        ['href'=>'#gallery','label'=>'Галерея'],
        ['href'=>'#reviews','label'=>'Отзывы'],
        ['href'=>'#location','label'=>'Локация'],
        ['href'=>'#contact','label'=>'Заявка'],
      ],
    ],
    'fields' => [
      ['name'=>'logo','label'=>'Текст логотипа','widget'=>'string'],
      ['name'=>'nav','label'=>'Пункты верхнего меню','widget'=>'list','fields'=>[
        ['name'=>'label','label'=>'Название','widget'=>'string'],
        ['name'=>'href','label'=>'Якорь раздела','widget'=>'string','hint'=>'куда ведёт пункт, напр. #pricing (на десктопе показываются первые 6)'],
      ]],
      ['name'=>'cta','label'=>'Кнопка «Оставить заявку»','widget'=>'string'],
    ],
  ],

  'background' => [
    'label' => '🖼️ Фон главного экрана',
    'file'  => 'background.json',
    'seed'  => ['hero' => '/hero-bg.jpg'],
    'fields' => [
      ['name'=>'hero','label'=>'Фоновое изображение (за заголовком)','widget'=>'image','hint'=>'Загрузите фото — оно станет фоном главного экрана. Пусто = фото по умолчанию.'],
    ],
  ],

  'hero' => [
    'label' => '🏖️ Главный экран (Hero)',
    'file'  => 'hero.json',
    'fields' => [
      ['name'=>'badge','label'=>'Бейдж','widget'=>'string'],
      ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
      ['name'=>'highlight','label'=>'Акцент (жёлтый текст)','widget'=>'string'],
      ['name'=>'subtitle','label'=>'Подзаголовок','widget'=>'text'],
      ['name'=>'description','label'=>'Описание','widget'=>'text'],
      ['name'=>'primaryButton','label'=>'Кнопка «Оставить заявку»','widget'=>'string'],
      ['name'=>'secondaryButton','label'=>'Кнопка «Заказать звонок»','widget'=>'string'],
    ],
  ],

  'features' => [
    'label' => '✨ Преимущества',
    'file'  => 'features.json',
    'fields' => [
      ['name'=>'sectionLabel','label'=>'Название секции','widget'=>'string'],
      ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
      ['name'=>'highlight','label'=>'Акцент','widget'=>'string'],
      ['name'=>'description','label'=>'Описание','widget'=>'text'],
      ['name'=>'items','label'=>'Карточки преимуществ','widget'=>'list','fields'=>[
        ['name'=>'icon','label'=>'Иконка','widget'=>'select','options'=>$ICONS],
        ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
        ['name'=>'description','label'=>'Описание','widget'=>'text'],
      ]],
    ],
  ],

  'pricing' => [
    'label' => '💰 Цены и смены',
    'file'  => 'pricing.json',
    'fields' => [
      ['name'=>'sectionLabel','label'=>'Название секции','widget'=>'string'],
      ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
      ['name'=>'highlight','label'=>'Акцент','widget'=>'string'],
      ['name'=>'description','label'=>'Описание','widget'=>'text'],
      ['name'=>'shifts','label'=>'Смены','widget'=>'list','fields'=>[
        ['name'=>'number','label'=>'Номер смены','widget'=>'string'],
        ['name'=>'dates','label'=>'Даты','widget'=>'string'],
        ['name'=>'days','label'=>'Длительность','widget'=>'string'],
      ]],
      ['name'=>'pricing','label'=>'Цены','widget'=>'list','fields'=>[
        ['name'=>'category','label'=>'Категория','widget'=>'string'],
        ['name'=>'price','label'=>'Цена','widget'=>'string'],
        ['name'=>'note','label'=>'Примечание','widget'=>'string'],
        ['name'=>'highlight','label'=>'Выделить','widget'=>'boolean'],
      ]],
      ['name'=>'extras','label'=>'Дополнительно','widget'=>'list','fields'=>[
        ['name'=>'title','label'=>'Название','widget'=>'string'],
        ['name'=>'price','label'=>'Цена','widget'=>'string'],
        ['name'=>'unit','label'=>'За что','widget'=>'string'],
      ]],
      ['name'=>'booking','label'=>'Бронирование','widget'=>'object','fields'=>[
        ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
        ['name'=>'deposit','label'=>'Предоплата','widget'=>'string'],
        ['name'=>'depositNote','label'=>'Примечание к предоплате','widget'=>'string'],
        ['name'=>'finalPayment','label'=>'Итоговый расчёт','widget'=>'text'],
        ['name'=>'qrTitle','label'=>'Заголовок QR','widget'=>'string'],
        ['name'=>'qrSubtitle','label'=>'Подпись QR','widget'=>'string'],
      ]],
      ['name'=>'howToBook','label'=>'Как оформить заявку','widget'=>'object','fields'=>[
        ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
        ['name'=>'steps','label'=>'Шаги','widget'=>'list','field'=>['label'=>'Шаг','widget'=>'text']],
      ]],
      ['name'=>'borderDocs','label'=>'Документы для границы','widget'=>'object','fields'=>[
        ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
        ['name'=>'items','label'=>'Пункты','widget'=>'list','fields'=>[
          ['name'=>'audience','label'=>'Для кого','widget'=>'string'],
          ['name'=>'doc','label'=>'Документ','widget'=>'string'],
        ]],
      ]],
    ],
  ],

  'accommodation' => [
    'label' => '🏠 Проживание',
    'file'  => 'accommodation.json',
    'fields' => [
      ['name'=>'sectionLabel','label'=>'Название секции','widget'=>'string'],
      ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
      ['name'=>'highlight','label'=>'Акцент','widget'=>'string'],
      ['name'=>'image','label'=>'Изображение','widget'=>'image'],
      ['name'=>'badge','label'=>'Бейдж на фото','widget'=>'object','fields'=>[
        ['name'=>'icon','label'=>'Иконка','widget'=>'string'],
        ['name'=>'title','label'=>'Текст','widget'=>'string'],
        ['name'=>'subtitle','label'=>'Подпись','widget'=>'string'],
      ]],
      ['name'=>'items','label'=>'Пункты описания','widget'=>'list','fields'=>[
        ['name'=>'icon','label'=>'Иконка','widget'=>'select','options'=>$ICONS],
        ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
        ['name'=>'description','label'=>'Описание','widget'=>'text'],
      ]],
    ],
  ],

  'transfer' => [
    'label' => '🚌 Трансфер',
    'file'  => 'transfer.json',
    'fields' => [
      ['name'=>'sectionLabel','label'=>'Название секции','widget'=>'string'],
      ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
      ['name'=>'highlight','label'=>'Акцент','widget'=>'string'],
      ['name'=>'description','label'=>'Описание','widget'=>'text'],
      ['name'=>'image','label'=>'Изображение','widget'=>'image'],
      ['name'=>'route','label'=>'Маршрут','widget'=>'string'],
      ['name'=>'distance','label'=>'Расстояние','widget'=>'string'],
      ['name'=>'time','label'=>'Время','widget'=>'string'],
      ['name'=>'price','label'=>'Цена','widget'=>'string'],
      ['name'=>'priceNote','label'=>'Примечание к цене','widget'=>'string'],
      ['name'=>'features','label'=>'Преимущества','widget'=>'list','field'=>['label'=>'Пункт','widget'=>'string']],
      ['name'=>'order','label'=>'Как заказать','widget'=>'text'],
    ],
  ],

  'dance' => [
    'label' => '💃 Танцевальный интенсив',
    'file'  => 'dance.json',
    'fields' => [
      ['name'=>'sectionLabel','label'=>'Название секции','widget'=>'string'],
      ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
      ['name'=>'highlight','label'=>'Акцент','widget'=>'string'],
      ['name'=>'description','label'=>'Описание','widget'=>'text'],
      ['name'=>'image','label'=>'Изображение','widget'=>'image'],
      ['name'=>'price','label'=>'Цена','widget'=>'string'],
      ['name'=>'priceNote','label'=>'Примечание к цене','widget'=>'string'],
      ['name'=>'program','label'=>'Программа','widget'=>'list','fields'=>[
        ['name'=>'title','label'=>'Название','widget'=>'string'],
        ['name'=>'desc','label'=>'Описание','widget'=>'text'],
      ]],
      ['name'=>'who','label'=>'Для кого','widget'=>'text'],
      ['name'=>'howToApply','label'=>'Как записаться','widget'=>'text'],
    ],
  ],

  'sports-camps' => [
    'label' => '🏆 Спортивные сборы',
    'file'  => 'sports-camps.json',
    'fields' => [
      ['name'=>'sectionLabel','label'=>'Название секции','widget'=>'string'],
      ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
      ['name'=>'highlight','label'=>'Акцент','widget'=>'string'],
      ['name'=>'description','label'=>'Описание','widget'=>'text'],
      ['name'=>'image','label'=>'Изображение','widget'=>'image'],
      ['name'=>'disciplines','label'=>'Дисциплины','widget'=>'list','fields'=>[
        ['name'=>'icon','label'=>'Иконка','widget'=>'select','options'=>['Trophy','Star','Music','Shield']],
        ['name'=>'name','label'=>'Название','widget'=>'string'],
        ['name'=>'details','label'=>'Описание','widget'=>'text'],
      ]],
      ['name'=>'tournaments','label'=>'Турниры','widget'=>'text'],
      ['name'=>'bonus','label'=>'Бонус','widget'=>'text'],
      ['name'=>'system','label'=>'Система','widget'=>'string'],
    ],
  ],

  'activities' => [
    'label' => '🎯 Программа и активности',
    'file'  => 'activities.json',
    'fields' => [
      ['name'=>'sectionLabel','label'=>'Название секции','widget'=>'string'],
      ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
      ['name'=>'highlight','label'=>'Акцент','widget'=>'string'],
      ['name'=>'description','label'=>'Описание','widget'=>'text'],
      ['name'=>'tabs','label'=>'Табы (вкладки)','widget'=>'list','fields'=>[
        ['name'=>'key','label'=>'Ключ','widget'=>'select','options'=>['all','creative','sport']],
        ['name'=>'label','label'=>'Название таба','widget'=>'string'],
      ]],
      ['name'=>'cards','label'=>'Карточки активностей','widget'=>'object','fields'=>[
        ['name'=>'all','label'=>'Для всех','widget'=>'list','fields'=>[
          ['name'=>'icon','label'=>'Иконка','widget'=>'select','options'=>$ICONS],
          ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
          ['name'=>'description','label'=>'Описание','widget'=>'text'],
        ]],
        ['name'=>'creative','label'=>'Творческие','widget'=>'list','fields'=>[
          ['name'=>'icon','label'=>'Иконка','widget'=>'select','options'=>$ICONS],
          ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
          ['name'=>'description','label'=>'Описание','widget'=>'text'],
        ]],
        ['name'=>'sport','label'=>'Спортивные','widget'=>'list','fields'=>[
          ['name'=>'icon','label'=>'Иконка','widget'=>'select','options'=>$ICONS],
          ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
          ['name'=>'description','label'=>'Описание','widget'=>'text'],
        ]],
      ]],
      ['name'=>'banners','label'=>'Баннеры','widget'=>'list','fields'=>[
        ['name'=>'image','label'=>'Изображение','widget'=>'image'],
        ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
        ['name'=>'description','label'=>'Описание','widget'=>'text'],
      ]],
    ],
  ],

  'gallery' => [
    'label' => '📸 Галерея',
    'file'  => 'gallery.json',
    'fields' => [
      ['name'=>'sectionLabel','label'=>'Название секции','widget'=>'string'],
      ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
      ['name'=>'highlight','label'=>'Акцент','widget'=>'string'],
      ['name'=>'description','label'=>'Описание','widget'=>'text'],
      ['name'=>'images','label'=>'Изображения','widget'=>'list','fields'=>[
        ['name'=>'src','label'=>'Изображение','widget'=>'image'],
        ['name'=>'alt','label'=>'Подпись','widget'=>'string'],
      ]],
    ],
  ],

  'location' => [
    'label' => '📍 Локация',
    'file'  => 'location.json',
    'fields' => [
      ['name'=>'sectionLabel','label'=>'Название секции','widget'=>'string'],
      ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
      ['name'=>'highlight','label'=>'Акцент','widget'=>'string'],
      ['name'=>'cards','label'=>'Карточки информации','widget'=>'list','fields'=>[
        ['name'=>'icon','label'=>'Иконка','widget'=>'select','options'=>$ICONS],
        ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
        ['name'=>'lines','label'=>'Строки','widget'=>'list','field'=>['label'=>'Текст','widget'=>'string']],
      ]],
    ],
  ],

  'reviews' => [
    'label' => '💬 Отзывы',
    'file'  => 'reviews.json',
    'fields' => [
      ['name'=>'sectionLabel','label'=>'Название секции','widget'=>'string'],
      ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
      ['name'=>'highlight','label'=>'Акцент','widget'=>'string'],
      ['name'=>'description','label'=>'Описание','widget'=>'text'],
      ['name'=>'submitButton','label'=>'Кнопка «Оставить отзыв»','widget'=>'string'],
      ['name'=>'formTitle','label'=>'Заголовок формы','widget'=>'string'],
      ['name'=>'formDescription','label'=>'Описание формы','widget'=>'text'],
      ['name'=>'formNameLabel','label'=>'Подпись «Имя»','widget'=>'string'],
      ['name'=>'formNamePlaceholder','label'=>'Плейсхолдер имени','widget'=>'string'],
      ['name'=>'formTextLabel','label'=>'Подпись «Текст»','widget'=>'string'],
      ['name'=>'formTextPlaceholder','label'=>'Плейсхолдер текста','widget'=>'string'],
      ['name'=>'formSubmit','label'=>'Кнопка отправки','widget'=>'string'],
      ['name'=>'formNote','label'=>'Примечание','widget'=>'string'],
      ['name'=>'items','label'=>'Отзывы','widget'=>'list','fields'=>[
        ['name'=>'name','label'=>'Имя','widget'=>'string'],
        ['name'=>'role','label'=>'Роль','widget'=>'string'],
        ['name'=>'rating','label'=>'Оценка','widget'=>'number','min'=>1,'max'=>5],
        ['name'=>'text','label'=>'Текст','widget'=>'text'],
        ['name'=>'date','label'=>'Дата','widget'=>'string'],
      ]],
    ],
  ],

  'contact' => [
    'label' => '📝 Форма заявки',
    'file'  => 'contact.json',
    'fields' => [
      ['name'=>'sectionLabel','label'=>'Название секции','widget'=>'string'],
      ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
      ['name'=>'highlight','label'=>'Акцент','widget'=>'string'],
      ['name'=>'description','label'=>'Описание','widget'=>'text'],
      ['name'=>'accessKey','label'=>'Web3Forms Access Key','widget'=>'string','hint'=>'Ключ с web3forms.com — определяет, на какую почту приходят заявки'],
      ['name'=>'emailTo','label'=>'Email получателя (справочно)','widget'=>'string','hint'=>'На доставку НЕ влияет — адрес задаётся ключом Web3Forms'],
      ['name'=>'form','label'=>'Настройки формы','widget'=>'object','fields'=>[
        ['name'=>'nameLabel','label'=>'Подпись «Имя»','widget'=>'string'],
        ['name'=>'namePlaceholder','label'=>'Плейсхолдер имени','widget'=>'string'],
        ['name'=>'phoneLabel','label'=>'Подпись «Телефон»','widget'=>'string'],
        ['name'=>'phonePlaceholder','label'=>'Плейсхолдер телефона','widget'=>'string'],
        ['name'=>'emailLabel','label'=>'Подпись «Email»','widget'=>'string'],
        ['name'=>'emailPlaceholder','label'=>'Плейсхолдер email','widget'=>'string'],
        ['name'=>'messageLabel','label'=>'Подпись «Комментарий»','widget'=>'string'],
        ['name'=>'messagePlaceholder','label'=>'Плейсхолдер комментария','widget'=>'string'],
        ['name'=>'submitButton','label'=>'Кнопка отправки','widget'=>'string'],
        ['name'=>'successTitle','label'=>'Заголовок успеха','widget'=>'string'],
        ['name'=>'successMessage','label'=>'Текст успеха','widget'=>'text'],
      ]],
      ['name'=>'subject','label'=>'Тема письма','widget'=>'string'],
    ],
  ],

  'footer' => [
    'label' => '👣 Подвал (Footer)',
    'file'  => 'footer.json',
    'fields' => [
      ['name'=>'brand','label'=>'Бренд','widget'=>'object','fields'=>[
        ['name'=>'title','label'=>'Название','widget'=>'string'],
        ['name'=>'subtitle','label'=>'Подзаголовок','widget'=>'string'],
        ['name'=>'description','label'=>'Описание','widget'=>'text'],
      ]],
      ['name'=>'contacts','label'=>'Контакты','widget'=>'object','fields'=>[
        ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
        ['name'=>'items','label'=>'Контакты','widget'=>'list','fields'=>[
          ['name'=>'icon','label'=>'Иконка','widget'=>'select','options'=>['Phone','Mail','MapPin','Waves','Mountain']],
          ['name'=>'label','label'=>'Текст','widget'=>'string'],
          ['name'=>'href','label'=>'Ссылка','widget'=>'string'],
        ]],
      ]],
      ['name'=>'links','label'=>'Ссылки','widget'=>'object','fields'=>[
        ['name'=>'title','label'=>'Заголовок','widget'=>'string'],
        ['name'=>'items','label'=>'Пункты меню','widget'=>'list','fields'=>[
          ['name'=>'href','label'=>'Ссылка (href)','widget'=>'string'],
          ['name'=>'label','label'=>'Название','widget'=>'string'],
        ]],
      ]],
      ['name'=>'copyright','label'=>'Копирайт','widget'=>'string'],
    ],
  ],
];
