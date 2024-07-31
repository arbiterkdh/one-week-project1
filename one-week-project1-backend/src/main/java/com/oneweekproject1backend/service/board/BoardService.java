package com.oneweekproject1backend.service.board;

import com.oneweekproject1backend.domain.board.Board;
import com.oneweekproject1backend.mapper.board.BoardMapper;
import com.oneweekproject1backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardService {
    private final BoardMapper boardMapper;
    private final MemberMapper memberMapper;

    public List<Board> getBoardList(Integer page) {
        Integer offset = (page - 1) * 10;

        List<Board> boardList = boardMapper.selectAllBoard(offset);
        if (!boardList.isEmpty()) {
            for (Board board : boardList) {
                board.setMemberNickname(getMemberNicknameByBoard(board));
                board.setBoardLikeCount(getBoardLikeCount(board.getBoardId()));
            }
        }
        return boardList;
    }

    public Board getBoard(Integer boardId) {
        Board board = boardMapper.selectBoardByBoardId(boardId);
        if (board != null) {
            boardMapper.updateBoardViewCountByBoardId(boardId);
            board = boardMapper.selectBoardByBoardId(boardId);

            board.setMemberNickname(getMemberNicknameByBoard(board));
            board.setBoardLikeCount(getBoardLikeCount(boardId));
            board.setBoardCommentCount(getBoardCommentCount(boardId));
            return board;
        }
        return null;
    }

    public String getMemberNicknameByBoard(Board board) {
        return memberMapper.selectMemberByMemberId(board.getBoardMemberId()).getMemberNickname();
    }

    public Integer getBoardLikeCount(Integer boardId) {
        Integer boardLikes = 0;
        boardLikes = boardMapper.countBoardLikeByBoardId(boardId);
        if (boardLikes > 0) {
            return boardLikes;
        }
        return 0;
    }

    private Integer getBoardCommentCount(Integer boardId) {
        return null;
    }

    public Board addBoard(Board board) {
        if (boardMapper.insertBoard(board) > 0) {
            return board;
        }
        return null;
    }

    public boolean deleteBoard(Integer boardMemberId, Integer boardId) {

        return boardMapper.deleteBoardByBoardMemberIdAndBoardId(boardMemberId, boardId) > 0;
    }

    public boolean updateBoard(Board board) {
        return boardMapper.updateBoard(board) > 0;
    }
}
