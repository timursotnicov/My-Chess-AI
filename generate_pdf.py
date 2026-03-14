from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("DejaVu", "I", 8)
            self.set_text_color(130, 130, 130)
            self.cell(0, 10, "Prompt Engineering Tutorial - Summary", align="C")
            self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font("DejaVu", "I", 8)
        self.set_text_color(130, 130, 130)
        self.cell(0, 10, f"Страница {self.page_no()}/{{nb}}", align="C")

    def chapter_title(self, num, title):
        self.set_font("DejaVu", "B", 14)
        self.set_text_color(40, 80, 160)
        self.cell(0, 10, f"Глава {num}: {title}", new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(40, 80, 160)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)

    def body_text(self, text):
        self.set_font("DejaVu", "", 10)
        self.set_text_color(40, 40, 40)
        self.multi_cell(0, 6, text)
        self.ln(2)

    def bold_text(self, text):
        self.set_font("DejaVu", "B", 10)
        self.set_text_color(40, 40, 40)
        self.multi_cell(0, 6, text)
        self.ln(1)

    def example_block(self, label, text):
        self.set_fill_color(245, 245, 250)
        self.set_font("DejaVu", "B", 9)
        self.set_text_color(80, 80, 80)
        self.cell(0, 6, label, new_x="LMARGIN", new_y="NEXT")
        self.set_font("DejaVu", "", 9)
        self.set_text_color(60, 60, 60)
        x = self.get_x()
        y = self.get_y()
        self.multi_cell(0, 5.5, text, fill=True)
        self.ln(3)

    def key_point(self, text):
        self.set_font("DejaVu", "", 10)
        self.set_text_color(40, 40, 40)
        self.cell(5, 6, "\u2022 ")
        self.multi_cell(0, 6, text)
        self.ln(1)


pdf = PDF()
pdf.alias_nb_pages()
pdf.set_auto_page_break(auto=True, margin=20)

# Load DejaVu font (supports Cyrillic)
pdf.add_font("DejaVu", "", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
pdf.add_font("DejaVu", "B", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
pdf.add_font("DejaVu", "I", "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Oblique.ttf")

# === TITLE PAGE ===
pdf.add_page()
pdf.ln(50)
pdf.set_font("DejaVu", "B", 28)
pdf.set_text_color(40, 80, 160)
pdf.cell(0, 15, "Prompt Engineering", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 15, "Tutorial", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.ln(10)
pdf.set_font("DejaVu", "", 14)
pdf.set_text_color(100, 100, 100)
pdf.cell(0, 10, "Полное руководство по работе с Claude", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.ln(20)
pdf.set_draw_color(40, 80, 160)
pdf.line(60, pdf.get_y(), 150, pdf.get_y())
pdf.ln(10)
pdf.set_font("DejaVu", "I", 11)
pdf.set_text_color(130, 130, 130)
pdf.cell(0, 8, "9 глав  |  Теория + Практика + Упражнения", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 8, "Составлено в ходе интерактивной сессии с Claude", align="C", new_x="LMARGIN", new_y="NEXT")

# === CHAPTER 1 ===
pdf.add_page()
pdf.chapter_title(1, "Роль (Role Prompting)")
pdf.body_text(
    "Назначение роли меняет стиль, глубину и тон ответа Claude. "
    "Это самый простой способ направить модель."
)
pdf.bold_text("Ключевая идея:")
pdf.body_text(
    "Один и тот же вопрос с разными ролями даёт принципиально разные ответы. "
    "Роль задаёт контекст, в котором модель генерирует ответ."
)
pdf.example_block(
    "Пример промпта:",
    "\"Ты - опытный детский врач-педиатр. Объясни родителям, почему важны прививки.\""
)
pdf.example_block(
    "vs.",
    "\"Ты - исследователь вакцин с 20-летним опытом. Объясни механизм работы мРНК-вакцин.\""
)
pdf.bold_text("Совет:")
pdf.body_text("Чем конкретнее роль, тем точнее ответ. \"Сеньор разработчик с 10 лет опыта\" лучше, чем просто \"программист\".")

# === CHAPTER 2 ===
pdf.chapter_title(2, "Тон (Tone)")
pdf.body_text(
    "Тон определяет, КАК модель доносит информацию: формально, дружелюбно, "
    "саркастично, академически и т.д."
)
pdf.bold_text("Ключевая идея:")
pdf.body_text(
    "Тон не меняет содержание, но влияет на восприятие. "
    "Один и тот же факт может звучать как лекция профессора или как совет друга."
)
pdf.example_block(
    "Пример:",
    "\"Отвечай в дружелюбном и ободряющем тоне, как будто ты наставник для джуниора.\""
)

# === CHAPTER 3 ===
pdf.chapter_title(3, "Правила и ограничения (Rules)")
pdf.body_text(
    "Правила задают границы поведения модели: что делать, чего избегать, "
    "какие ограничения соблюдать."
)
pdf.bold_text("Ключевая идея:")
pdf.body_text(
    "Чёткие правила предотвращают нежелательное поведение модели. "
    "Лучше явно указать ограничения, чем надеяться, что модель сама догадается."
)
pdf.example_block(
    "Пример:",
    "\"Правила:\n"
    "- Отвечай только на русском языке\n"
    "- Не используй жаргон\n"
    "- Если не знаешь ответ - честно скажи об этом\n"
    "- Ограничь ответ 3 предложениями\""
)

# === CHAPTER 4 ===
pdf.chapter_title(4, "Примеры (Few-Shot Prompting)")
pdf.body_text(
    "Few-shot prompting - это предоставление модели примеров желаемого "
    "ввода/вывода перед основной задачей. Один из самых мощных приёмов."
)
pdf.bold_text("Ключевая идея:")
pdf.body_text(
    "Примеры показывают модели ФОРМАТ, СТИЛЬ и ЛОГИКУ ожидаемого ответа. "
    "Это работает лучше, чем длинные текстовые описания."
)
pdf.example_block(
    "Пример:",
    "\"Классифицируй отзыв как позитивный или негативный.\n\n"
    "Отзыв: Отличный товар, доставили быстро!\n"
    "Класс: позитивный\n\n"
    "Отзыв: Ужасное качество, верну обратно.\n"
    "Класс: негативный\n\n"
    "Отзыв: Всё хорошо, но упаковка помята.\n"
    "Класс:\""
)
pdf.bold_text("Совет:")
pdf.body_text("2-3 примеров обычно достаточно. Больше примеров = больше стабильность формата.")

# === CHAPTER 5 ===
pdf.add_page()
pdf.chapter_title(5, "XML-теги для структуры")
pdf.body_text(
    "XML-теги позволяют чётко разделить разные части промпта: "
    "данные, инструкции, формат вывода. Claude отлично понимает XML."
)
pdf.bold_text("Ключевая идея:")
pdf.body_text(
    "Теги устраняют двусмысленность. Модель точно знает, где данные, "
    "где инструкции, и в каком формате отвечать."
)
pdf.example_block(
    "Пример:",
    "<document>\n"
    "  текст для анализа...\n"
    "</document>\n\n"
    "<instructions>\n"
    "  Найди ключевые тезисы в документе выше.\n"
    "</instructions>\n\n"
    "<output_format>\n"
    "  Ответь в формате нумерованного списка.\n"
    "</output_format>"
)
pdf.bold_text("Популярные теги:")
pdf.key_point("<document>, <context> - для входных данных")
pdf.key_point("<instructions> - для задачи")
pdf.key_point("<example> - для примеров")
pdf.key_point("<quotes> - для цитат из источника")
pdf.key_point("<thinking>, <issues> - для внутренних размышлений")

# === CHAPTER 6 ===
pdf.chapter_title(6, "Формулировка задачи (Task)")
pdf.body_text(
    "Чёткая, конкретная формулировка задачи - основа хорошего промпта. "
    "Чем точнее задача, тем точнее результат."
)
pdf.bold_text("Ключевая идея:")
pdf.body_text(
    "Избегайте расплывчатых формулировок. \"Проанализируй код\" хуже, чем "
    "\"Найди потенциальные баги и проблемы с производительностью в этом коде\"."
)
pdf.example_block(
    "Плохо:",
    "\"Помоги с кодом.\""
)
pdf.example_block(
    "Хорошо:",
    "\"Проведи code-review этой функции. Найди баги, проблемы безопасности "
    "и предложи улучшения производительности.\""
)

# === CHAPTER 7 ===
pdf.add_page()
pdf.chapter_title(7, "Пошаговое мышление (Chain of Thought)")
pdf.body_text(
    "Инструкция \"думай шаг за шагом\" заставляет модель рассуждать "
    "последовательно, что значительно улучшает точность на сложных задачах."
)
pdf.bold_text("Ключевая идея:")
pdf.body_text(
    "Без CoT модель может \"перескакивать\" к ответу, пропуская важные шаги. "
    "С CoT она проходит полную цепочку рассуждений."
)
pdf.example_block(
    "Пример:",
    "\"Реши задачу. Думай шаг за шагом, показывая каждый этап рассуждений.\n\n"
    "Задача: В магазине было 45 яблок. Продали 1/3, потом привезли ещё 20. "
    "Сколько яблок стало?\""
)
pdf.bold_text("Когда использовать:")
pdf.key_point("Математические задачи")
pdf.key_point("Логические рассуждения")
pdf.key_point("Многошаговый анализ")
pdf.key_point("Задачи с неочевидным ответом")

# === CHAPTER 8 ===
pdf.chapter_title(8, "Формат вывода (Output Format)")
pdf.body_text(
    "Явное указание формата вывода гарантирует, что ответ будет структурирован "
    "именно так, как вам нужно."
)
pdf.bold_text("Ключевая идея:")
pdf.body_text(
    "Модель может отвечать в любом формате: JSON, таблица, список, "
    "код, markdown. Но нужно явно об этом попросить."
)
pdf.example_block(
    "Пример:",
    "\"Ответь строго в формате JSON:\n"
    "{\n"
    "  \"sentiment\": \"positive/negative/neutral\",\n"
    "  \"confidence\": 0.0-1.0,\n"
    "  \"reasoning\": \"краткое обоснование\"\n"
    "}\""
)

# === CHAPTER 9 ===
pdf.chapter_title(9, "Построение сложных промптов")
pdf.body_text(
    "Финальная глава объединяет все техники. Сложный промпт может комбинировать "
    "любые из 9 элементов в зависимости от задачи."
)
pdf.bold_text("Все 9 элементов:")
pdf.key_point("1. Роль / контекст")
pdf.key_point("2. Тон")
pdf.key_point("3. Правила")
pdf.key_point("4. Примеры (Few-Shot)")
pdf.key_point("5. Данные в XML-тегах")
pdf.key_point("6. Задача")
pdf.key_point("7. Пошаговое мышление (CoT)")
pdf.key_point("8. Формат вывода")
pdf.key_point("9. Префилл (начало ответа)")

pdf.ln(3)
pdf.bold_text("Финальное упражнение (Code Review бот):")
pdf.body_text(
    "В качестве итогового задания был построен комплексный промпт, "
    "объединивший: роль (сеньор-разработчик), правила (сократический метод), "
    "XML-теги (<issues> / <response>), и чёткую задачу (code-review)."
)
pdf.body_text(
    "Результат: Claude нашёл ZeroDivisionError в функции calculate_average([]) "
    "и задал наводящие вопросы вместо прямых указаний."
)

# === CHEAT SHEET ===
pdf.add_page()
pdf.set_font("DejaVu", "B", 18)
pdf.set_text_color(40, 80, 160)
pdf.cell(0, 12, "Шпаргалка (Cheat Sheet)", align="C", new_x="LMARGIN", new_y="NEXT")
pdf.set_draw_color(40, 80, 160)
pdf.line(10, pdf.get_y(), 200, pdf.get_y())
pdf.ln(8)

cheat = [
    ("Роль", "\"Ты - [роль] с [опыт]. Твоя задача - ...\""),
    ("Тон", "\"Отвечай в [прилагательное] тоне\""),
    ("Правила", "\"Правила:\\n- Делай X\\n- Не делай Y\""),
    ("Few-Shot", "\"Пример 1: вход -> выход\\nПример 2: вход -> выход\\nТеперь: ...\""),
    ("XML-теги", "\"<data>...</data> <instructions>...</instructions>\""),
    ("Задача", "\"Твоя задача: [конкретное действие] для [цель]\""),
    ("CoT", "\"Думай шаг за шагом\" / \"Размышляй в <thinking>\""),
    ("Формат", "\"Ответь в формате [JSON/список/таблица/...]\""),
    ("Префилл", "Начни ответ за модель: \"{ \\\"result\\\":\""),
]

for title, template in cheat:
    pdf.set_font("DejaVu", "B", 11)
    pdf.set_text_color(40, 80, 160)
    pdf.cell(35, 7, title)
    pdf.set_font("DejaVu", "", 9)
    pdf.set_text_color(60, 60, 60)
    pdf.multi_cell(0, 7, template)
    pdf.ln(2)

pdf.ln(5)
pdf.set_font("DejaVu", "B", 11)
pdf.set_text_color(40, 80, 160)
pdf.cell(0, 8, "Главное правило:", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("DejaVu", "", 11)
pdf.set_text_color(40, 40, 40)
pdf.multi_cell(0, 7,
    "Не нужно использовать все 9 техник в каждом промпте. "
    "Берите только то, что нужно для конкретной задачи. "
    "Простая задача = простой промпт. Сложная задача = комбинация техник."
)

# Save
output_path = "/home/user/My-Chess-AI/Prompt_Engineering_Tutorial_Summary.pdf"
pdf.output(output_path)
print(f"PDF saved to: {output_path}")
