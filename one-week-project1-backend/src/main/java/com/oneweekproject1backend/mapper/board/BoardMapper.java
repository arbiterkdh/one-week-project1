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
                (SELECT COUNT(*) FROM board_like bl WHERE bl.board_like_board_id = b.board_id) AS board_like_count,
                COUNT(DISTINCT bc.board_comment_id) AS board_comment_count
            FROM board b JOIN member m ON b.board_member_id = m.member_id
                         LEFT JOIN board_like bl ON b.board_id = bl.board_like_board_id
                         LEFT JOIN board_comment bc ON b.board_id = bc.board_comment_board_id
            WHERE b.board_id=#{boardId}
            """)
    Board selectBoardByBoardId(Integer boardId);

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
                b.board_inserted,
                b.board_updated,
                b.board_view_count,
                m.member_nickname AS member_nickname,
                (SELECT COUNT(*) FROM board_like bl WHERE bl.board_like_board_id = b.board_id) AS board_like_count,
                COUNT(DISTINCT bc.board_comment_id) AS board_comment_count
            FROM board b JOIN member m ON b.board_member_id = m.member_id
                         LEFT JOIN board_like bl ON b.board_id = bl.board_like_board_id
                         LEFT JOIN board_comment bc ON b.board_id = bc.board_comment_board_id
            <trim prefix="WHERE" prefixOverrides="AND">
                <if test="boardType != 'general'">
                    b.board_type = #{boardType}
                </if>
                <if test="keyword != null and searchType != null">
                    <bind name="pattern" value="'%' + keyword + '%'" />
                    <choose>
                        <when test="searchType == 'title'">
                            AND b.board_title LIKE #{pattern}
                        </when>
                        <when test="searchType == 'content'">
                            AND b.board_content LIKE #{pattern}
                        </when>
                        <when test="searchType == 'titleOrContent'">
                            AND (b.board_title LIKE #{pattern}
                                 OR b.board_content LIKE #{pattern})
                        </when>
                        <when test="searchType == 'nickname'">
                            AND m.member_nickname LIKE #{pattern}
                        </when>
                        <otherwise>
                            AND (b.board_title LIKE #{pattern}
                                 OR b.board_content LIKE #{pattern}
                                 OR m.member_nickname LIKE #{pattern})
                        </otherwise>
                    </choose>
                </if>
            </trim>
            GROUP BY b.board_id
            ORDER BY
            <choose>
                <when test="sortState == 'none'"></when>
                <otherwise>
                    <choose>
                        <when test="sortType == 'like'">
                            <if test="sortState == 'up'">
                                board_like_count DESC,
                            </if>
                            <if test="sortState == 'down'">
                                board_like_count ASC,
                            </if>
                        </when>
                        <when test="sortType == 'view'">
                            <if test="sortState == 'up'">
                                b.board_view_count DESC,
                            </if>
                            <if test="sortState == 'down'">
                                b.board_view_count ASC,
                            </if>
                        </when>
                    </choose>
                </otherwise>
            </choose>
            b.board_id DESC
            LIMIT #{offset}, 10
            </script>
            """)
    List<Board> selectAllBoardBySearchTypeAndKeyword(String boardType, String searchType, String keyword, String sortState, String sortType, Integer offset);

    @Select("""
            <script>
            SELECT COUNT(b.board_id)
            FROM board b JOIN member m ON b.board_member_id = m.member_id
                <trim prefix="WHERE" prefixOverrides="AND">
                <if test="boardType != 'general'">
                    b.board_type = #{boardType}
                </if>
                <if test="searchType != null">
                    <bind name="pattern" value="'%' + keyword + '%'" />
                    <choose>
                    <when test="searchType == 'title'">
                        AND b.board_title LIKE #{pattern}
                    </when>
                    <when test="searchType == 'content'">
                        AND b.board_content LIKE #{pattern}
                    </when>
                    <when test="searchType == 'titleOrContent'">
                        AND (b.board_title LIKE #{pattern}
                             OR b.board_content LIKE #{pattern})
                    </when>
                    <when test="searchType == 'nickname'">
                        AND m.member_nickname LIKE #{pattern}
                    </when>
                    <otherwise>
                        AND (b.board_title LIKE #{pattern}
                             OR b.board_content LIKE #{pattern}
                             OR m.member_nickname LIKE #{pattern})
                    </otherwise>
                    </choose>
                </if>
            </trim>
            </script>
            """)
    Integer countAllBoardByBoardTypeAndSearchTypeAndKeyword(String boardType, String searchType, String keyword);

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

    @Select("""
            SELECT COUNT(*) FROM board_like
            WHERE board_like_board_id=#{boardId}
            """)
    int selectBoardLikeByBoardLikeBoardId(Integer boardId);

    @Delete("""
            DELETE FROM board_like
            WHERE board_like_board_id=#{boardId}
            """)
    int deleteBoardLikeByBoardLikeBoardId(Integer boardId);
}
