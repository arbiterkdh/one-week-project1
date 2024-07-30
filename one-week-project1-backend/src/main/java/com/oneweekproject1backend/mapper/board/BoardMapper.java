package com.oneweekproject1backend.mapper.board;

import com.oneweekproject1backend.domain.board.Board;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Select("""
            SELECT
                board_id,
                board_member_id,
                board_title,
                board_content,
                board_inserted,
                board_view_count
            FROM board
            ORDER BY board_id DESC
            """)
    List<Board> selectAllBoard();

    @Select("""
            SELECT
                board_id,
                board_member_id,
                board_title,
                board_content,
                board_inserted,
                board_view_count
            FROM board
            WHERE board_id=#{boardId}
            """)
    Board selectBoardByBoardId(Integer boardId);

    @Select("""
            SELECT COUNT(*)
            FROM board_like
            WHERE board_like_board_id=#{boardId}
            """)
    Integer countBoardLikeByBoardId(Integer boardId);

    @Update("""
            UPDATE board
            SET board_view_count=board_view_count+1
            WHERE board_id=#{boardId}
            """)
    int updateBoardViewCountByBoardId(Integer boardId);
}
