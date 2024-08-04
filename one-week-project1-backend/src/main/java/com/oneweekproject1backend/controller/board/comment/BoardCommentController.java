package com.oneweekproject1backend.controller.board.comment;

import com.oneweekproject1backend.domain.board.comment.BoardComment;
import com.oneweekproject1backend.service.board.comment.BoardCommentService;
import com.oneweekproject1backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board/comment")
@RequiredArgsConstructor
public class BoardCommentController {

    private final BoardCommentService boardCommentService;
    private final MemberService memberService;

    @GetMapping("/{boardId}")
    public List<BoardComment> getBoardComment(@PathVariable Integer boardId) {
        return boardCommentService.getBoardComment(boardId);
    }

    @PostMapping("/write")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity writeBoardComment(@RequestBody BoardComment boardComment) {
        boolean result = boardCommentService.addBoardComment(boardComment);
        if (result) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @PutMapping("/modify")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity updateBoard(@RequestBody BoardComment boardComment, Authentication authentication) {
        if (memberService.hasAccess(boardComment.getBoardCommentMemberId(), authentication)) {
            boolean result = boardCommentService.updateBoardComment(boardComment);
            if (result) {
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @DeleteMapping("/delete/{memberId}/{boardCommentId}")
    public ResponseEntity deleteBoardComment(
            @PathVariable Integer memberId,
            @PathVariable Integer boardCommentId,
            Authentication authentication
    ) {
        if (memberService.hasAccess(memberId, authentication)) {
            boolean result = boardCommentService.deleteBoardComment(boardCommentId);
            if (result) {
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
