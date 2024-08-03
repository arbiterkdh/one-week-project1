USE `one-week-project1`;


CREATE TABLE member
(
    member_id       INT PRIMARY KEY AUTO_INCREMENT,
    member_email    VARCHAR(200)  NOT NULL UNIQUE,
    member_nickname VARCHAR(40)   NOT NULL UNIQUE,
    member_password VARCHAR(1000) NOT NULL,
    member_inserted DATETIME      NOT NULL DEFAULT NOW(),
    member_updated  DATETIME      NOT NULL DEFAULT NOW()
);

SELECT *
FROM member;

DROP TABLE member;

DELETE
FROM member;

CREATE TABLE authority
(
    authority_id               INT PRIMARY KEY AUTO_INCREMENT,
    authority_member_id        INT REFERENCES member (member_id),
    authority_member_authority VARCHAR(50) NOT NULL
);

SELECT *
FROM authority;

DROP TABLE authority;

INSERT INTO authority
    (authority_member_id, authority_member_authority)
VALUES (1, 'USER');

CREATE TABLE email_verify_number
(
    email         VARCHAR(200) NOT NULL UNIQUE,
    verify_number INT          NOT NULL UNIQUE,
    PRIMARY KEY (email, verify_number)
);


SELECT *
FROM email_verify_number;

DELETE
FROM email_verify_number;

SELECT *
FROM member;

CREATE TABLE board
(
    board_id         INT PRIMARY KEY AUTO_INCREMENT,
    board_member_id  INT REFERENCES member (member_id),
    board_type       VARCHAR(50)   NOT NULL,
    board_title      VARCHAR(200)  NOT NULL,
    board_content    VARCHAR(5000) NOT NULL,
    board_inserted   DATETIME      NOT NULL DEFAULT NOW(),
    board_updated    DATETIME      NOT NULL DEFAULT NOW(),
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
DROP TABLE board_like;
DROP TABLE board_comment;

INSERT INTO board
    (board_member_id, board_type, board_title, board_content)
VALUES (1, '잡담', '사랑해요백예린엉엉', '예린백그저빛');

INSERT INTO board
    (board_member_id, board_type, board_title, board_content)
SELECT board_member_id, board_type, board_title, board_content
FROM board;

SELECT *
FROM board;

EXPLAIN
SELECT b.board_id,
       b.board_type,
       b.board_title,
       b.board_inserted,
       b.board_updated,
       b.board_view_count,
       m.member_nickname                 AS member_nickname,
       COUNT(bl.board_like_member_id)    AS board_like_count,
       COUNT(bc.board_comment_member_id) AS board_comment_count
FROM board b
         JOIN member m ON b.board_member_id = m.member_id
         LEFT JOIN board_like bl ON b.board_id = bl.board_like_board_id
         LEFT JOIN board_comment bc ON b.board_id = bc.board_comment_board_id
WHERE b.board_title LIKE '%다%'
GROUP BY b.board_id
ORDER BY board_like_count DESC, b.board_id DESC;


CREATE INDEX idx_board_type ON board (board_type);
CREATE INDEX idx_board_title ON board (board_title);
CREATE INDEX idx_board_content ON board (board_content);
CREATE INDEX idx_board_member_id ON board (board_member_id);
CREATE INDEX board_like_board_id ON board_like (board_like_board_id);
CREATE INDEX idx_board_comment_board_id ON board_comment (board_comment_board_id);

SHOW INDEX FROM board_comment;
SHOW INDEX FROM board_like;
SHOW INDEX FROM board;
SHOW INDEX FROM member;

SHOW FULL PROCESSLIST;

KILL 70050;

CREATE TABLE board_comment
(
    board_comment_id        INT PRIMARY KEY AUTO_INCREMENT,
    board_comment_board_id  INT REFERENCES board (board_id),
    board_comment_member_id INT REFERENCES member (member_id),
    board_comment_content   VARCHAR(1000) NOT NULL
);

SELECT *
FROM board_comment;