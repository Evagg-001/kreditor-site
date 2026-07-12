# Внедрение V10 Conversion

1. Перейти в `develop`.
2. Сделать резервную копию.
3. Заменить файлы содержимым архива.
4. Проверить:
   ```bash
   git status
   git diff --check
   python3 -m http.server 8000
   ```
5. Проверить:
   - модальное окно;
   - desktop-панель;
   - мобильную панель V9;
   - формы;
   - страницу контактов;
   - главную страницу.
6. Зафиксировать:
   ```bash
   git add .
   git commit -m "Release KREDITOR V10 Conversion"
   git push origin develop
   ```
7. После проверки слить `develop` в `main`.
