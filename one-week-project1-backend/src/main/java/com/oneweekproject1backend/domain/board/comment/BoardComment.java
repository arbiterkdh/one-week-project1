package com.oneweekproject1backend.domain.board.comment;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BoardComment {
    private Integer boardCommentId;
    private Integer boardCommentBoardId;
    private Integer boardCommentMemberId;
    private String boardCommentContent;
    private LocalDateTime boardCommentInserted;
    private LocalDateTime boardCommentUpdated;

    // bc 테이블엔 없고 따로 담아서 보내는 용
    private String memberNickname;
}
