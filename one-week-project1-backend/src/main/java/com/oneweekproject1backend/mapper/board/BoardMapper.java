package com.oneweekproject1backend.mapper.board;

import com.oneweekproject1backend.domain.board.Board;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Select("""
            SELECT
                board_id,
                board_member_id,
                board_type,
                board_title,
                board_content,
                board_inserted,
                board_updated,
                board_view_count
            FROM board
            ORDER BY board_id DESC
            LIMIT #{offset}, 10
            """)
    List<Board> selectAllBoard(Integer offset);

    @Select("""
            SELECT
                board_id,
                board_member_id,
                board_type,
                board_title,
                board_content,
                board_inserted,
                board_updated,
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

    @Insert("""
            INSERT INTO board
            (board_member_id, board_type, board_title, board_content)
            VALUES(#{boardMemberId}, #{boardType}, #{boardTitle}, #{boardContent})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "boardId")
    int insertBoard(Board board);

    @Delete("""
            DELETE FROM board
            WHERE board_id=#{boardId}
            AND board_member_id=#{boardMemberId}
            """)
    int deleteBoardByBoardMemberIdAndBoardId(Integer boardMemberId, Integer boardId);

    @Update("""
            UPDATE board
            SET board_type=#{boardType},
                board_title=#{boardTitle},
                board_content=#{boardContent},
                board_updated=NOW()
            WHERE board_id=#{boardId}
            AND board_member_id=#{boardMemberId}
            """)
    int updateBoard(Board board);
}
