package com.oneweekproject1backend.controller.board;

import com.oneweekproject1backend.domain.board.Board;
import com.oneweekproject1backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/list")
    public ResponseEntity getBoardList() {
        List<Board> boardList = boardService.getBoardList();
        if (boardList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(boardList);
    }

    @GetMapping("/view/{boardId}")
    public ResponseEntity getBoardView(@PathVariable Integer boardId) {
        Board board = boardService.getBoard(boardId);
        if (board == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(board);
    }

    @PostMapping("/write/upload")
    public ResponseEntity writeBoard(@RequestBody Board board) {
        return null;
    }
}
