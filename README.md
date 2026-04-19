# 🎌 Anime Assistant — Мария

Интерактивный аниме ассистент с Live2D персонажем, голосовым управлением и искусственным интеллектом.

![Технологии](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
![Python](https://img.shields.io/badge/Python-3.12-yellow?style=for-the-badge&logo=python)

---

## ✨ Возможности

- 🎭 **Live2D персонаж** — анимированная аниме модель с физикой волос и одежды
- 🤖 **AI чат** — общение с персонажем через GigaChat API
- 🎤 **Голосовой ввод** — говори с Марией через микрофон
- 🔊 **Голосовой ответ** — Мария отвечает голосом через локальный Silero TTS
- 💬 **Эмоции** — персонаж реагирует на контекст разговора (радость, грусть, удивление)
- ✨ **Частицы** — фоновые эффекты меняют цвет в зависимости от эмоции
- 🔇 **Управление голосом** — можно отключить озвучку одной кнопкой

---

## 🛠️ Стек технологий

### Frontend
- **Next.js 16** — React фреймворк с App Router
- **TypeScript** — типизация
- **Tailwind CSS** — стилизация
- **Shadcn UI** — UI компоненты
- **pixi.js** + **pixi-live2d-display** — рендеринг Live2D модели
- **Canvas API** — анимация частиц

### AI и голос
- **GigaChat API** — языковая модель для общения (Сбер)
- **Silero TTS** — локальная нейросеть для синтеза речи на русском языке
- **Web Speech API** — распознавание голоса в браузере

### Backend
- **Next.js API Routes** — серверные роуты для безопасного хранения ключей
- **Python HTTP Server** — локальный TTS сервер на базе Silero + PyTorch

---

## 🚀 Как запустить

### Требования
- Node.js 18+
- Python 3.12
- PyTorch (с поддержкой CUDA для ускорения)

### 1. Клонируй репозиторий
```bash
git clone https://github.com/yuracherichenko/anime-assistant.git
cd anime-assistant
```

### 2. Установи зависимости
```bash
npm install
```

```bash
py -3.12 -m pip install torch torchaudio soundfile git+https://github.com/daswer123/silero-tts-enhanced.git
```

### 3. Создай файл `.env.local`
```
GIGACHAT_CLIENT_SECRET=твой_ключ_от_gigachat
```

### 4. Запусти TTS сервер (в отдельном терминале)
```bash
py -3.12 tts_server.py
```

### 5. Запусти приложение
```bash
npm run dev
```

Открой **http://localhost:3000**

---

## 🎨 Как это работает

```
Пользователь говорит/пишет
        ↓
Web Speech API распознаёт речь
        ↓
Текст отправляется в GigaChat API
        ↓
GigaChat возвращает ответ + эмоцию (happy/sad/surprised/angry)
        ↓
Текст отправляется в Silero TTS сервер
        ↓
Мария озвучивает ответ + двигает губами
        ↓
Частицы меняют цвет по эмоции
```

---

## 📁 Структура проекта

```
anime-assistant/
├── public/
│   └── hb_free/          # Live2D модель персонажа
├── src/
│   ├── app/
│   │   ├── api/chat/     # Серверный роут для GigaChat
│   │   └── page.tsx      # Главная страница
│   └── components/
│       ├── Live2DModel.tsx   # Рендеринг Live2D
│       ├── Chat.tsx          # Чат с AI
│       └── Particles.tsx     # Анимация частиц
├── tts_server.py         # Python TTS сервер
└── test_tts.py           # Тест голоса
```

---

## 🤖 Роль ИИ в разработке

Этот проект был создан в процессе обучения frontend разработке с помощью **Claude AI**. ИИ помогал:

- Объяснять концепции (TanStack Query, React Hook Form, Zod)
- Разбирать ошибки и находить решения
- Подбирать библиотеки и технологии
- Настраивать интеграцию Live2D с Next.js
- Решать проблемы совместимости Python библиотек

Весь код писался и понимался самостоятельно — ИИ выступал в роли наставника, а не генератора кода.

---

## 👨‍💻 Автор

**Черниченко Юрий** — начинающий frontend разработчик

- GitHub: [github.com/yuracherichenko](https://github.com/yuracherichenko)
- hh.ru: Frontend-разработчик, Санкт-Петербург

---

> 💡 Проект создан как часть портфолио в процессе самостоятельного изучения frontend разработки
