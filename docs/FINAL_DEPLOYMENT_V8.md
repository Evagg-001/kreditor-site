# Внедрение KREDITOR V8 Final

1. Работать только в ветке `develop`.
2. Сделать резервную копию папки `kreditor-site`.
3. Скопировать содержимое архива в `kreditor-site`, сохранив `.git`.
4. Выполнить:
   ```bash
   git status
   git diff --check
   python3 -m http.server 8000
   ```
5. Проверить модальное окно и все четыре канала связи.
6. После проверки:
   ```bash
   git add .
   git commit -m "Release KREDITOR V8 Final"
   git push origin develop
   ```
7. После подтверждения:
   ```bash
   git checkout main
   git pull origin main
   git merge develop
   git push origin main
   ```
