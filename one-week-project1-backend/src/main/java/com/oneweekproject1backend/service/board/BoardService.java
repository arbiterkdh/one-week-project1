package com.oneweekproject1backend.service.board;

import com.oneweekproject1backend.domain.board.Board;
import com.oneweekproject1backend.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardService {
    private final BoardMapper boardMapper;

    public Map<String, Object> getBoardList(
            Integer page,
            String boardType,
            String searchType,
            String keyword,
            String sortState,
            String sortType
    ) {
        Integer offset = (page - 1) * 10;
        Integer countAll = boardMapper.countAllBoardByBoardTypeAndSearchTypeAndKeyword(boardType, searchType, keyword);

        List<Board> boardList =
                boardMapper.selectAllBoardBySearchTypeAndKeyword(boardType, searchType, keyword, sortState, sortType, offset);

        Integer endPageNumber = (countAll - 1) / 10 + 1;
        Integer leftPageNumber =
                page < 4 ? 1 :
                        page < endPageNumber - 1 ? page - 2 :
                                page < endPageNumber ? page - 3 : page - 4;
        Integer rightPageNumber =
                endPageNumber < 6 ? endPageNumber :
                        page < 4 ? 5 :
                                page < endPageNumber - 1 ? page + 2 :
                                        page < endPageNumber ? page + 1 : page;

        Integer prevPageNumber = Math.max(1, page - 5);
        Integer nextPageNumber = Math.min(endPageNumber, page + 5);

        return Map.of(
                "boardList", boardList,
                "pageInfo", Map.of(
                        "endPageNumber", endPageNumber,
                        "leftPageNumber", leftPageNumber,
                        "rightPageNumber", rightPageNumber,
                        "prevPageNumber", prevPageNumber,
                        "nextPageNumber", nextPageNumber));
    }

    public Board getBoard(Integer boardId, Authentication authentication) {
        Board board = boardMapper.selectBoardByBoardId(boardId);
        if (board != null) {
            boardMapper.updateBoardViewCountByBoardId(boardId);
            board = boardMapper.selectBoardByBoardId(boardId);
            board.setIsLikedByMemberId(
                    boardMapper.selectBoardLike(
                            boardId, Integer.parseInt(authentication.getName())) > 0);
            return board;
        }
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

    public Board handleBoardLike(Board board) {
        boolean isLikedBoard = boardMapper.selectBoardLike(board.getBoardId(), board.getBoardMemberId()) > 0;
        if (isLikedBoard) {
            boardMapper.deleteBoardLike(board.getBoardId(), board.getBoardMemberId());
        } else {
            boardMapper.insertBoardLike(board.getBoardId(), board.getBoardMemberId());
        }
        return boardMapper.selectBoardByBoardId(board.getBoardId());
    }
}
