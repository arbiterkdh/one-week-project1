package com.oneweekproject1backend.domain.board.comment;

import lombok.Data;

@Data
public class BoardComment {
    private Integer boardCommentId;
    private Integer boardCommentBoardId;
    private Integer boardCommentMemberId;
    private String boardCommentContent;
}
