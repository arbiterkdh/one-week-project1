package com.oneweekproject1backend.controller.board;

import com.oneweekproject1backend.domain.board.Board;
import com.oneweekproject1backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/list")
    public ResponseEntity getBoardList(@RequestParam(value = "page", defaultValue = "1") Integer page) {
        List<Board> boardList = boardService.getBoardList(page);
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
    public ResponseEntity writeBoard(Board board) {
        Board addedBoard = null;
        addedBoard = boardService.addBoard(board);
        if (addedBoard != null) {
            return ResponseEntity.ok(addedBoard);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @DeleteMapping("/delete/{boardMemberId}/{boardId}")
    public ResponseEntity deleteBoard(@PathVariable Integer boardMemberId, @PathVariable Integer boardId) {
        boolean result = boardService.deleteBoard(boardMemberId, boardId);
        if (result) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @PutMapping("/modify")
    public ResponseEntity updateBoard(@RequestBody Board board) {
        boolean result = boardService.updateBoard(board);
        if (result) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
