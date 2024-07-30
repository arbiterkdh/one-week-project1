USE `one-week-project1`;


CREATE TABLE member
(
    member_id       INT PRIMARY KEY AUTO_INCREMENT,
    member_email    VARCHAR(200)  NOT NULL UNIQUE,
    member_nickname VARCHAR(40)   NOT NULL UNIQUE,
    member_password VARCHAR(1000) NOT NULL
);

INSERT INTO member
    (member_email, member_nickname, member_password)
VALUES ('kdhsmarto@gmail.com', '동글', 1234);

SELECT *
FROM member;

CREATE TABLE board
(
    board_id         INT PRIMARY KEY AUTO_INCREMENT,
    board_member_id  INT REFERENCES member (member_id),
    board_title      VARCHAR(200)  NOT NULL,
    board_content    VARCHAR(5000) NOT NULL,
    board_inserted   DATETIME      NOT NULL DEFAULT NOW(),
    board_view_count INT           NOT NULL DEFAULT 0
);

CREATE TABLE board_like
(
    board_like_board_id  INT REFERENCES board (board_id),
    board_like_member_id INT REFERENCES member (member_id),
    PRIMARY KEY (board_like_board_id, board_like_member_id)
);

SELECT *
FROM board_like;

DROP TABLE board;

INSERT INTO board
    (board_member_id, board_title, board_content)
VALUES (1, '사랑해요백예린엉엉', '예린백그저빛');

SELECT *
FROM board;

CREATE TABLE board_comment
(
    board_comment_id        INT PRIMARY KEY AUTO_INCREMENT,
    board_comment_board_id  INT REFERENCES board (board_id),
    board_comment_member_id INT REFERENCES member (member_id),
    board_comment_content   VARCHAR(1000) NOT NULL
);