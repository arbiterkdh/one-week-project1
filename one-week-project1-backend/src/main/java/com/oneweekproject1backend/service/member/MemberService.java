package com.oneweekproject1backend.service.member;

import com.oneweekproject1backend.domain.member.EmailVerifyNumber;
import com.oneweekproject1backend.domain.member.Member;
import com.oneweekproject1backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class MemberService {


    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;
    private final MemberMapper memberMapper;

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    String fromAddress;

    public String checkEmailValidate(String email) {
        boolean isNormalForm = email.matches("^[a-zA-Z0-9\\-_]+@[a-zA-Z0-9-]+\\.[a-zA-Z]+$");
        if (!isNormalForm) {
            return "invalid email";
        } else if (memberMapper.selectMemberByMemberEmail(email) != null) {
            return "already signed in";
        } else if (memberMapper.selectEmailVerifyNumberByEmail(email) != null) {
            return "already in verifying";
        }
        return "valid email";
    }

    public void sendEmailVerifyNumber(EmailVerifyNumber email) throws MailException {
        Integer emailVerifyNumber = null;
        EmailVerifyNumber dbEmailVerifyNumber = null;
        do {
            emailVerifyNumber = 0;
            while (emailVerifyNumber < 100000) {
                emailVerifyNumber = (int) (Math.random() * 1000000);
            }
            dbEmailVerifyNumber = memberMapper.selectEmailByVerifyNumber(emailVerifyNumber);
        } while (dbEmailVerifyNumber != null);

        email.setVerifyNumber(emailVerifyNumber);
        memberMapper.insertVerifyNumberTemporary(email);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email.getEmail());
        message.setFrom("생존코딩" + " <" + fromAddress + ">");
        message.setSubject("생존코딩에서 인증번호를 보내드립니다.");
        message.setText(STR."인증번호는 [  \{emailVerifyNumber}  ] 입니다.");

        mailSender.send(message);
    }

    public boolean checkVerifyNumber(EmailVerifyNumber email) {
        boolean isCorrectVerifyNumber = memberMapper.checkEmailVerifyNumberByEmailAndVerifyNumber(email) != null;
        if (isCorrectVerifyNumber) {
            return memberMapper.deleteEmailVerifyNumberByEmailVerifyNumber(email) > 0;
        }
        return false;
    }

    public boolean deleteEmailVerifyNumber(String email) {
        EmailVerifyNumber dbEmailVerifyNumber = new EmailVerifyNumber();
        dbEmailVerifyNumber.setEmail(email);
        return memberMapper.deleteEmailVerifyNumberByEmailVerifyNumber(dbEmailVerifyNumber) > 0;
    }

    public boolean checkNickname(String nickname) {
        return memberMapper.selectMemberByMemberNickname(nickname) == null;
    }

    public boolean addMember(Member member) {

        member.setMemberPassword(passwordEncoder.encode(member.getMemberPassword()));
        return memberMapper.insertMember(member) > 0;
    }
}
