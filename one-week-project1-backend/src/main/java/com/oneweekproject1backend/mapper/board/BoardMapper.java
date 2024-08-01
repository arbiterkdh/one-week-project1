package com.oneweekproject1backend.mapper.board;

import com.oneweekproject1backend.domain.board.Board;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Select("""
            SELECT
                b.board_id,
                b.board_member_id,
                b.board_type,
                b.board_title,
                b.board_content,
                b.board_inserted,
                b.board_updated,
                b.board_view_count,
                m.member_nickname AS member_nickname,
                COUNT(bl.board_like_member_id) AS board_like_count,
                COUNT(bc.board_comment_member_id) AS board_comment_count
            FROM board b JOIN member m ON b.board_member_id = m.member_id
                         LEFT JOIN board_like bl ON b.board_id = bl.board_like_board_id
                         LEFT JOIN board_comment bc ON b.board_id = bc.board_comment_board_id
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

    @Select("""
            <script>
            SELECT
                b.board_id,
                b.board_member_id,
                b.board_type,
                b.board_title,
                b.board_content,
                b.board_inserted,
                b.board_updated,
                b.board_view_count,
                m.member_nickname AS member_nickname,
                COUNT(bl.board_like_member_id) AS board_like_count,
                COUNT(bc.board_comment_member_id) AS board_comment_count
            FROM board b JOIN member m ON b.board_member_id = m.member_id
                         LEFT JOIN board_like bl ON b.board_id = bl.board_like_board_id
                         LEFT JOIN board_comment bc ON b.board_id = bc.board_comment_board_id
                <trim prefix="WHERE" prefixOverrides="OR">
                    <if test="searchType != null">
                        <bind name="pattern" value="'%' + keyword + '%'" />
                        <if test="searchType == 'all'">
                            OR b.board_title LIKE #{pattern}
                            OR b.board_content LIKE #{pattern}
                            OR m.member_nickname LIKE #{pattern}
                        </if>
                        <if test="searchType == 'title'">
                            OR b.board_title LIKE #{pattern}
                        </if>
                        <if test="searchType == 'content'">
                            OR b.board_content LIKE #{pattern}
                        </if>
                        <if test="searchType == 'titleOrContent'">
                            OR b.board_title LIKE #{pattern}
                            OR b.board_content LIKE #{pattern}
                        </if>
                        <if test="searchType == 'nickname'">
                            OR m.member_nickname LIKE #{pattern}
                        </if>
                    </if>
                </trim>
            GROUP BY b.board_id
            ORDER BY board_id DESC
            LIMIT #{offset}, 10
            </script>
            """)
    List<Board> selectAllBoardBySearchTypeAndKeyword(String searchType, String keyword, Integer offset);

    @Select("""
            <script>
            SELECT COUNT(b.board_id)
            FROM board b JOIN member m ON b.board_member_id = m.member_id
                <trim prefix="WHERE" prefixOverrides="OR">
                    <if test="searchType != null">
                        <bind name="pattern" value="'%' + keyword + '%'" />
                        <if test="searchType == 'all'">
                            OR b.board_title LIKE #{pattern}
                            OR b.board_content LIKE #{pattern}
                            OR m.member_nickname LIKE #{pattern}
                        </if>
                        <if test="searchType == 'title'">
                            OR b.board_title LIKE #{pattern}
                        </if>
                        <if test="searchType == 'content'">
                            OR b.board_content LIKE #{pattern}
                        </if>
                        <if test="searchType == 'titleOrContent'">
                            OR b.board_title LIKE #{pattern}
                            OR b.board_content LIKE #{pattern}
                        </if>
                        <if test="searchType == 'nickname'">
                            OR m.member_nickname LIKE #{pattern}
                        </if>
                    </if>
                </trim>
            </script>
            """)
    Integer countAllBoardBySearchTypeAndKeyword(String searchType, String keyword);

    @Select("""
            SELECT COUNT(*) FROM board_like
            WHERE board_like_board_id=#{boardId}
            AND board_like_member_id=#{boardMemberId}
            """)
    int selectBoardLike(Integer boardId, Integer boardMemberId);

    @Delete("""
            DELETE FROM board_like
            WHERE board_like_board_id=#{boardId}
            AND board_like_member_id=#{boardMemberId}
            """)
    int deleteBoardLike(Integer boardId, Integer boardMemberId);

    @Insert("""
            INSERT INTO board_like
            (board_like_board_id, board_like_member_id)
            VALUES(#{boardId}, #{boardMemberId})
            """)
    int insertBoardLike(Integer boardId, Integer boardMemberId);
}
