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

SELECT *
FROM board;

CREATE TABLE board_comment
(
    board_comment_id        INT PRIMARY KEY AUTO_INCREMENT,
    board_comment_board_id  INT REFERENCES board (board_id),
    board_comment_member_id INT REFERENCES member (member_id),
    board_comment_content   VARCHAR(1000) NOT NULL
);

SELECT *
FROM board_comment;