# Внедрение V9 Growth

1. Работать в `develop`.
2. Сделать резервную копию.
3. Заменить файлы содержимым архива.
4. Проверить:
   ```bash
   git status
   git diff --check
   python3 -m http.server 8000
   ```
5. Проверить мобильную панель, формы и метаданные.
6. Выполнить:
   ```bash
   git add .
   git commit -m "Release KREDITOR V9 Growth"
   git push origin develop
   ```
7. После проверки слить `develop` в `main`.
