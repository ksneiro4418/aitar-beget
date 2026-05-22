backend:
  name: git-gateway
  branch: main

media_folder: public/uploads
public_folder: /uploads

collections:
  - name: site
    label: Сайт
    files:
      - name: hero
        label: 🏖️ Главный экран (Hero)
        file: public/content/hero.json
        fields:
          - { label: Бейдж, name: badge, widget: string }
          - { label: Заголовок, name: title, widget: string }
          - { label: Акцент (жёлтый текст), name: highlight, widget: string }
          - { label: Подзаголовок, name: subtitle, widget: text }
          - { label: Описание, name: description, widget: text }
          - { label: Кнопка "Оставить заявку", name: primaryButton, widget: string }
          - { label: Кнопка "Заказать звонок", name: secondaryButton, widget: string }

      - name: features
        label: ✨ Преимущества
        file: public/content/features.json
        fields:
          - { label: Название секции, name: sectionLabel, widget: string }
          - { label: Заголовок, name: title, widget: string }
          - { label: Акцент, name: highlight, widget: string }
          - { label: Описание, name: description, widget: text }
          - label: Карточки преимуществ
            name: items
            widget: list
            fields:
              - { label: Иконка, name: icon, widget: select, options: [Palmtree, Shield, Heart, Sunrise, Mountain, Star, Waves, Music, Trophy, Utensils, MapPin, Mail, Phone, Bed, CheckCircle] }
              - { label: Заголовок, name: title, widget: string }
              - { label: Описание, name: description, widget: text }

      - name: pricing
        label: 💰 Цены и смены
        file: public/content/pricing.json
        fields:
          - { label: Название секции, name: sectionLabel, widget: string }
          - { label: Заголовок, name: title, widget: string }
          - { label: Акцент, name: highlight, widget: string }
          - { label: Описание, name: description, widget: text }
          - label: Смены
            name: shifts
            widget: list
            fields:
              - { label: Номер смены, name: number, widget: string }
              - { label: Даты, name: dates, widget: string }
              - { label: Длительность, name: days, widget: string }
          - label: Цены
            name: pricing
            widget: list
            fields:
              - { label: Категория, name: category, widget: string }
              - { label: Цена, name: price, widget: string }
              - { label: Примечание, name: note, widget: string }
              - { label: Выделить, name: highlight, widget: boolean }
          - label: Дополнительно
            name: extras
            widget: list
            fields:
              - { label: Название, name: title, widget: string }
              - { label: Цена, name: price, widget: string }
              - { label: За что, name: unit, widget: string }
          - label: Бронирование
            name: booking
            widget: object
            fields:
              - { label: Заголовок, name: title, widget: string }
              - { label: Предоплата, name: deposit, widget: string }
              - { label: Примечание к предоплате, name: depositNote, widget: string }
              - { label: Итоговый расчёт, name: finalPayment, widget: text }
              - { label: Заголовок QR, name: qrTitle, widget: string }
              - { label: Подпись QR, name: qrSubtitle, widget: string }
          - label: Как оформить заявку
            name: howToBook
            widget: object
            fields:
              - { label: Заголовок, name: title, widget: string }
              - label: Шаги
                name: steps
                widget: list
                field: { label: Шаг, name: step, widget: text }
          - label: Документы для границы
            name: borderDocs
            widget: object
            fields:
              - { label: Заголовок, name: title, widget: string }
              - label: Пункты
                name: items
                widget: list
                fields:
                  - { label: Для кого, name: audience, widget: string }
                  - { label: Документ, name: doc, widget: string }

      - name: accommodation
        label: 🏠 Проживание
        file: public/content/accommodation.json
        fields:
          - { label: Название секции, name: sectionLabel, widget: string }
          - { label: Заголовок, name: title, widget: string }
          - { label: Акцент, name: highlight, widget: string }
          - { label: Изображение, name: image, widget: image }
          - label: Бейдж на фото
            name: badge
            widget: object
            fields:
              - { label: Иконка, name: icon, widget: string }
              - { label: Текст, name: title, widget: string }
              - { label: Подпись, name: subtitle, widget: string }
          - label: Пункты описания
            name: items
            widget: list
            fields:
              - { label: Иконка, name: icon, widget: select, options: [Bed, CheckCircle, Utensils, Shield, Waves, Music, Trophy, Star, Mountain, Palmtree, Heart, Sunrise, MapPin, Phone, Mail] }
              - { label: Заголовок, name: title, widget: string }
              - { label: Описание, name: description, widget: text }

      - name: transfer
        label: 🚌 Трансфер
        file: public/content/transfer.json
        fields:
          - { label: Название секции, name: sectionLabel, widget: string }
          - { label: Заголовок, name: title, widget: string }
          - { label: Акцент, name: highlight, widget: string }
          - { label: Описание, name: description, widget: text }
          - { label: Изображение, name: image, widget: image }
          - { label: Маршрут, name: route, widget: string }
          - { label: Расстояние, name: distance, widget: string }
          - { label: Время, name: time, widget: string }
          - { label: Цена, name: price, widget: string }
          - { label: Примечание к цене, name: priceNote, widget: string }
          - label: Преимущества
            name: features
            widget: list
            field: { label: Пункт, name: feature, widget: string }
          - { label: Как заказать, name: order, widget: text }

      - name: dance
        label: 💃 Танцевальный интенсив
        file: public/content/dance.json
        fields:
          - { label: Название секции, name: sectionLabel, widget: string }
          - { label: Заголовок, name: title, widget: string }
          - { label: Акцент, name: highlight, widget: string }
          - { label: Описание, name: description, widget: text }
          - { label: Изображение, name: image, widget: image }
          - { label: Цена, name: price, widget: string }
          - { label: Примечание к цене, name: priceNote, widget: string }
          - label: Программа
            name: program
            widget: list
            fields:
              - { label: Название, name: title, widget: string }
              - { label: Описание, name: desc, widget: text }
          - { label: Для кого, name: who, widget: text }
          - { label: Как записаться, name: howToApply, widget: text }

      - name: sports-camps
        label: 🏆 Спортивные сборы
        file: public/content/sports-camps.json
        fields:
          - { label: Название секции, name: sectionLabel, widget: string }
          - { label: Заголовок, name: title, widget: string }
          - { label: Акцент, name: highlight, widget: string }
          - { label: Описание, name: description, widget: text }
          - { label: Изображение, name: image, widget: image }
          - label: Дисциплины
            name: disciplines
            widget: list
            fields:
              - { label: Иконка, name: icon, widget: select, options: [Trophy, Star, Music, Shield] }
              - { label: Название, name: name, widget: string }
              - { label: Описание, name: details, widget: text }
          - { label: Турниры, name: tournaments, widget: text }
          - { label: Бонус, name: bonus, widget: text }
          - { label: Система, name: system, widget: string }

      - name: activities
        label: 🎯 Программа и активности
        file: public/content/activities.json
        fields:
          - { label: Название секции, name: sectionLabel, widget: string }
          - { label: Заголовок, name: title, widget: string }
          - { label: Акцент, name: highlight, widget: string }
          - { label: Описание, name: description, widget: text }
          - label: Табы (вкладки)
            name: tabs
            widget: list
            fields:
              - { label: Ключ, name: key, widget: select, options: [{ label: Для всех, value: all }, { label: Творческие, value: creative }, { label: Спортивные, value: sport }] }
              - { label: Название таба, name: label, widget: string }
          - label: Карточки активностей (Для всех)
            name: cards
            widget: object
            fields:
              - label: Для всех
                name: all
                widget: list
                fields:
                  - { label: Иконка, name: icon, widget: select, options: [Waves, Music, Trophy, Utensils, Star, Heart, Shield, Bed, CheckCircle, Palmtree, Sunrise, Mountain, MapPin, Phone, Mail] }
                  - { label: Заголовок, name: title, widget: string }
                  - { label: Описание, name: description, widget: text }
              - label: Творческие
                name: creative
                widget: list
                fields:
                  - { label: Иконка, name: icon, widget: select, options: [Waves, Music, Trophy, Utensils, Star, Heart, Shield, Bed, CheckCircle, Palmtree, Sunrise, Mountain, MapPin, Phone, Mail] }
                  - { label: Заголовок, name: title, widget: string }
                  - { label: Описание, name: description, widget: text }
              - label: Спортивные
                name: sport
                widget: list
                fields:
                  - { label: Иконка, name: icon, widget: select, options: [Waves, Music, Trophy, Utensils, Star, Heart, Shield, Bed, CheckCircle, Palmtree, Sunrise, Mountain, MapPin, Phone, Mail] }
                  - { label: Заголовок, name: title, widget: string }
                  - { label: Описание, name: description, widget: text }
          - label: Баннеры
            name: banners
            widget: list
            fields:
              - { label: Изображение, name: image, widget: image }
              - { label: Заголовок, name: title, widget: string }
              - { label: Описание, name: description, widget: text }

      - name: gallery
        label: 📸 Галерея
        file: public/content/gallery.json
        fields:
          - { label: Название секции, name: sectionLabel, widget: string }
          - { label: Заголовок, name: title, widget: string }
          - { label: Акцент, name: highlight, widget: string }
          - { label: Описание, name: description, widget: text }
          - label: Изображения
            name: images
            widget: list
            fields:
              - { label: Изображение, name: src, widget: image }
              - { label: Подпись, name: alt, widget: string }

      - name: location
        label: 📍 Локация
        file: public/content/location.json
        fields:
          - { label: Название секции, name: sectionLabel, widget: string }
          - { label: Заголовок, name: title, widget: string }
          - { label: Акцент, name: highlight, widget: string }
          - label: Карточки информации
            name: cards
            widget: list
            fields:
              - { label: Иконка, name: icon, widget: select, options: [MapPin, Waves, Mountain, Shield, Star, Palmtree, Heart, Sunrise, Bed, Phone, Mail, Music, Trophy, Utensils, CheckCircle] }
              - { label: Заголовок, name: title, widget: string }
              - label: Строки
                name: lines
                widget: list
                field: { label: Текст, name: line, widget: string }

      - name: reviews
        label: 💬 Отзывы
        file: public/content/reviews.json
        fields:
          - { label: Название секции, name: sectionLabel, widget: string }
          - { label: Заголовок, name: title, widget: string }
          - { label: Акцент, name: highlight, widget: string }
          - { label: Описание, name: description, widget: text }
          - { label: Кнопка "Оставить отзыв", name: submitButton, widget: string }
          - { label: Заголовок формы, name: formTitle, widget: string }
          - { label: Описание формы, name: formDescription, widget: text }
          - { label: Подпись "Имя", name: formNameLabel, widget: string }
          - { label: Плейсхолдер имени, name: formNamePlaceholder, widget: string }
          - { label: Подпись "Текст", name: formTextLabel, widget: string }
          - { label: Плейсхолдер текста, name: formTextPlaceholder, widget: string }
          - { label: Кнопка отправки, name: formSubmit, widget: string }
          - { label: Примечание, name: formNote, widget: string }
          - label: Отзывы
            name: items
            widget: list
            fields:
              - { label: Имя, name: name, widget: string }
              - { label: Роль, name: role, widget: string }
              - { label: Оценка, name: rating, widget: number, min: 1, max: 5 }
              - { label: Текст, name: text, widget: text }
              - { label: Дата, name: date, widget: string }

      - name: contact
        label: 📝 Форма заявки
        file: public/content/contact.json
        fields:
          - { label: Название секции, name: sectionLabel, widget: string }
          - { label: Заголовок, name: title, widget: string }
          - { label: Акцент, name: highlight, widget: string }
          - { label: Описание, name: description, widget: text }
          - { label: Web3Forms Access Key, name: accessKey, widget: string, hint: "Получите на web3forms.com" }
          - { label: Email получателя, name: emailTo, widget: string }
          - label: Настройки формы
            name: form
            widget: object
            fields:
              - { label: Подпись "Имя", name: nameLabel, widget: string }
              - { label: Плейсхолдер имени, name: namePlaceholder, widget: string }
              - { label: Подпись "Телефон", name: phoneLabel, widget: string }
              - { label: Плейсхолдер телефона, name: phonePlaceholder, widget: string }
              - { label: Подпись "Email", name: emailLabel, widget: string }
              - { label: Плейсхолдер email, name: emailPlaceholder, widget: string }
              - { label: Подпись "Комментарий", name: messageLabel, widget: string }
              - { label: Плейсхолдер комментария, name: messagePlaceholder, widget: string }
              - { label: Кнопка отправки, name: submitButton, widget: string }
              - { label: Заголовок успеха, name: successTitle, widget: string }
              - { label: Текст успеха, name: successMessage, widget: text }
          - { label: Тема письма, name: subject, widget: string }

      - name: footer
        label: 👣 Подвал (Footer)
        file: public/content/footer.json
        fields:
          - label: Бренд
            name: brand
            widget: object
            fields:
              - { label: Название, name: title, widget: string }
              - { label: Подзаголовок, name: subtitle, widget: string }
              - { label: Описание, name: description, widget: text }
          - label: Контакты
            name: contacts
            widget: object
            fields:
              - { label: Заголовок, name: title, widget: string }
              - label: Контакты
                name: items
                widget: list
                fields:
                  - { label: Иконка, name: icon, widget: select, options: [Phone, Mail, MapPin, Waves, Mountain] }
                  - { label: Текст, name: label, widget: string }
                  - { label: Ссылка, name: href, widget: string }
          - label: Ссылки
            name: links
            widget: object
            fields:
              - { label: Заголовок, name: title, widget: string }
              - label: Пункты меню
                name: items
                widget: list
                fields:
                  - { label: Ссылка (href), name: href, widget: string }
                  - { label: Название, name: label, widget: string }
          - { label: Копирайт, name: copyright, widget: string }