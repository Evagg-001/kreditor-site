# Развёртывание V6–V7

1. Работать только в ветке `develop`.
2. Сделать резервную копию.
3. Заменить содержимое проекта содержимым архива, не удаляя `.git`.
4. Запустить `python3 -m http.server 8000`.
5. Проверить страницы и формы.
6. `git add .`
7. `git commit -m "Deploy KREDITOR V6-V7 master release"`
8. `git push origin develop`
9. После тестирования объединить `develop` в `main`.

`analytics-config.js` не содержит секретов. ID аналитики заполняются отдельно.
