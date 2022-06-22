CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  url VARCHAR(255) NOT NULL,
  likes INTEGER DEFAULT(0)
);

INSERT INTO blogs (title, author, url) VALUES ('Enchiridion', 'Epictetus', '');
INSERT INTO blogs (title, author, url) VALUES ('Beyond Good & Evil', 'Friedrich Nietzsche', '');