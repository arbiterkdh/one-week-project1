package com.oneweekproject1backend.controller.board;

import com.oneweekproject1backend.domain.board.Board;
import com.oneweekproject1backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/list")
    public ResponseEntity getBoardList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "general") String boardType,
            @RequestParam(required = false, name = "type") String searchType,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "none") String sortState,
            @RequestParam(required = false, defaultValue = "none") String sortType
    ) {
        Map<String, Object> map = boardService.getBoardList(page, boardType, searchType, keyword, sortState, sortType);
        if (map.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(map);
    }

    @GetMapping("/view/{boardId}")
    public ResponseEntity getBoardView(@PathVariable Integer boardId, Authentication authentication) {
        Board board = boardService.getBoard(boardId, authentication);
        if (board == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(board);
    }

    @PostMapping("/write/upload")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity writeBoard(Board board) {
        Board addedBoard = null;
        addedBoard = boardService.addBoard(board);
        if (addedBoard != null) {
            return ResponseEntity.ok(addedBoard);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @DeleteMapping("/delete/{boardMemberId}/{boardId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity deleteBoard(@PathVariable Integer boardMemberId, @PathVariable Integer boardId) {
        boolean result = boardService.deleteBoard(boardMemberId, boardId);
        if (result) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @PutMapping("/modify")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity updateBoard(@RequestBody Board board) {
        boolean result = boardService.updateBoard(board);
        if (result) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @PostMapping("/like")
    public Board handleBoardLike(@RequestBody Board board) {
        return boardService.handleBoardLike(board);
    }
}
