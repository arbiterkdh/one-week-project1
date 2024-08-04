package com.oneweekproject1backend.service.board.comment;

import com.oneweekproject1backend.domain.board.comment.BoardComment;
import com.oneweekproject1backend.mapper.board.comment.BoardCommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardCommentService {

    private final BoardCommentMapper boardCommentMapper;


    public List<BoardComment> getBoardComment(Integer boardId) {
        return boardCommentMapper.selectAllCommentByBoardCommentBoardId(boardId);
    }

    public boolean addBoardComment(BoardComment boardComment) {
        return boardCommentMapper.insertBoardComment(boardComment) > 0;
    }

    public boolean updateBoardComment(BoardComment boardComment) {
        return boardCommentMapper.updateBoardComment(boardComment) > 0;
    }

    public boolean deleteBoardComment(Integer boardCommentId) {
        return boardCommentMapper.deleteBoardComment(boardCommentId) > 0;
    }
}
