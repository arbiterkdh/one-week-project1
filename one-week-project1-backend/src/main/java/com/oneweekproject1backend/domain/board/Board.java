package com.oneweekproject1backend.domain.board;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Board {
    private Integer boardId;
    private Integer boardMemberId;
    private String boardType;
    private String boardTitle;
    private String boardContent;
    private LocalDateTime boardInserted;
    private Integer boardViewCount;

    // frontend 에 따로 담아서 보내기 위한 용도
    private String memberNickname;
    private Integer boardLikeCount;
    private Integer boardCommentCount;
}
