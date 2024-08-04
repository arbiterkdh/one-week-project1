package com.oneweekproject1backend.mapper.board.comment;

import com.oneweekproject1backend.domain.board.comment.BoardComment;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BoardCommentMapper {

    @Select("""
            SELECT 
                bc.board_comment_id,
                bc.board_comment_board_id,
                bc.board_comment_member_id,
                bc.board_comment_content,
                bc.board_comment_inserted,
                bc.board_comment_updated,
                m.member_nickname AS member_nickname
            FROM board_comment bc
            JOIN member m ON bc.board_comment_member_id = m.member_id
            WHERE bc.board_comment_board_id=#{boardId}
            """)
    List<BoardComment> selectAllCommentByBoardCommentBoardId(Integer boardId);

    @Insert("""
            INSERT INTO board_comment
            (board_comment_board_id, board_comment_member_id, board_comment_content)
            VALUES (#{boardCommentBoardId}, #{boardCommentMemberId}, #{boardCommentContent})
            """)
    int insertBoardComment(BoardComment boardComment);

    @Update("""
            UPDATE board_comment
            SET board_comment_content=#{boardCommentContent},
                board_comment_updated=NOW()
            WHERE board_comment_id=#{boardCommentId}
            """)
    int updateBoardComment(BoardComment boardComment);

    @Delete("""
            DELETE FROM board_comment
            WHERE board_comment_id=#{boardCommentId}
            """)
    int deleteBoardComment(Integer boardCommentId);

    @Delete("""
            DELETE FROM board_comment
            WHERE board_comment_board_id=#{boardId}
            """)
    int deleteAllBoardCommentByBoardId(Integer boardId);
}
