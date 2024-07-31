package com.oneweekproject1backend.mapper.member;

import com.oneweekproject1backend.domain.member.EmailVerifyNumber;
import com.oneweekproject1backend.domain.member.Member;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MemberMapper {

    @Select("""
            SELECT
                member_id,
                member_email,
                member_nickname,
                member_password
            FROM member
            WHERE member_id=#{boardMemberId}
            """)
    Member selectMemberByMemberId(Integer boardMemberId);

    @Select("""
            SELECT
                member_id,
                member_email,
                member_nickname,
                member_password
            FROM member
            WHERE member_email=#{email}
            """)
    Member selectMemberByMemberEmail(String email);

    @Select("""
            SELECT
                email,
                verify_number
            FROM email_verify_number
            WHERE email=#{email}
            """)
    EmailVerifyNumber selectEmailVerifyNumberByEmail(String email);

    @Select("""
            SELECT
                email,
                verify_number
            FROM email_verify_number
            WHERE verify_number=#{verifyNumber}
            """)
    EmailVerifyNumber selectEmailByVerifyNumber(Integer verifyNumber);

    @Insert("""
            INSERT INTO email_verify_number(email,verify_number)
            VALUES (#{email},#{verifyNumber})
            """)
    int insertVerifyNumberTemporary(EmailVerifyNumber emailVerifyNumber);

    @Select("""
            SELECT
                email,
                verify_number
            FROM email_verify_number
            WHERE email=#{email}
            AND verify_number=#{verifyNumber}
            """)
    EmailVerifyNumber checkEmailVerifyNumberByEmailAndVerifyNumber(EmailVerifyNumber email);

    @Delete("""
            DELETE FROM email_verify_number
            WHERE email=#{email}
            OR verify_number=#{verifyNumber}
            """)
    int deleteEmailVerifyNumberByEmailVerifyNumber(EmailVerifyNumber email);

    @Select("""
            SELECT *
            FROM member
            WHERE member_nickname=#{nickname}
            """)
    Member selectMemberByMemberNickname(String nickname);

    @Insert("""
            INSERT INTO member
            ( member_email, member_nickname, member_password )
            VALUES (#{memberEmail}, #{memberNickname}, #{memberPassword})
            """)
    int insertMember(Member member);

    @Select("""
            SELECT authority_member_authority
            FROM authority
            WHERE authority_member_id = #{memberId}
            """)
    List<String> selectAuthorityByMemberId(Integer memberId);
}
