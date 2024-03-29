
INSERT INTO users
      (email, password_hash, first_name, last_name, avatar)
VALUES
      ('ivanov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Иван', 'Иванов', 'avatar1.jpg'),
      ('petrov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Пётр', 'Петров', 'avatar2.jpg');

INSERT INTO categories
      (name)
VALUES
      ('Деревья'),
      ('За жизнь'),
      ('Без рамки'),
      ('Разное'),
      ('IT'),
      ('Музыка'),
      ('Кино'),
      ('Программирование'),
      ('Железо'),
      ('Углеводы'),
      ('Жиры');

ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles
      (title, publication_date, announce, full_text, picture, user_id)
VALUES
      ('Ёлки. История деревьев', '2021-07-18 20:17:08', 'Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.', 'Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Простые ежедневные упражнения помогут достичь успеха. Программировать не настолько сложно, как об этом говорят. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Минздрав заявил о возможности третьей волны пандемии COVID-19 в России. Золотое сечение — соотношение двух величин, гармоническая пропорция. Он написал больше 30 хитов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Первая большая ёлка была установлена только в 1938 году. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.', 'item07.jpg', 2),
      ('Самый лучший музыкальный альбом этого года', '2021-09-23 14:16:30', 'Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.', 'Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина. Собрать камни бесконечности легко, если вы прирожденный герой.', 'item03.jpg', 2),
      ('Налетай и покупай', '2021-08-16 19:20:05', '', 'Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Программировать не настолько сложно, как об этом говорят. Золотое сечение — соотношение двух величин, гармоническая пропорция.', 'item07.jpg', 1);
ALTER TABLE articles ENABLE TRIGGER ALL;

ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories
      (article_id, category_id)
VALUES
      (1, 3),
      (2, 5),
      (3, 1);
ALTER TABLE articles_categories ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO COMMENTS
      (text, user_id, article_id)
VALUES
      ('Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.', 2, 1),
      ('Согласен с автором!', 1, 1),
      ('Мне кажется или я уже читал это где-то? Совсем немного... Планируете записать видосик на эту тему?', 2, 1),
      ('Планируете записать видосик на эту тему?', 1, 2),
      ('Хочу такую же футболку :-)', 2, 2),
      ('Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного...', 1, 3),
      ('Совсем немного...', 1, 3),
      ('Планируете записать видосик на эту тему?', 2, 3);
ALTER TABLE comments ENABLE TRIGGER ALL;