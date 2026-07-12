# Развёртывание в ветку develop

1. Убедитесь, что активна ветка `develop`:
   ```bash
   git branch --show-current
   ```
2. Сделайте резервную копию текущей папки проекта.
3. Замените видимые файлы проекта содержимым релиза. Папку `.git` не удаляйте.
4. Выполните:
   ```bash
   git add .
   git commit -m "Deploy KREDITOR Master Release 5.0"
   git pull origin develop --rebase
   git push origin develop
   ```
5. Проверьте ветку `develop` на GitHub.
6. После тестирования создайте Pull Request `develop` → `main`.
7. После слияния GitHub Pages обновит сайт из `main`.
