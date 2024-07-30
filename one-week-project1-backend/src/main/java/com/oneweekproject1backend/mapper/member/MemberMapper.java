package com.oneweekproject1backend.mapper.member;

import com.oneweekproject1backend.domain.member.Member;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface MemberMapper {

    @Select("""
            SELECT
                member_id,
                member_email,
                member_nickname,
                member_password
            FROM member
            """)
    Member selectMemberByMemberId(Integer boardMemberId);
}
