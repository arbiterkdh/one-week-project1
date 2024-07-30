package com.oneweekproject1backend.controller.member;

import com.oneweekproject1backend.domain.member.EmailVerifyNumber;
import com.oneweekproject1backend.domain.member.Member;
import com.oneweekproject1backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("signup")
    public ResponseEntity signup(@RequestBody Member member) {
        boolean isAdded = memberService.addMember(member);
        if (isAdded) {

            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping("/signup/email/check")
    public ResponseEntity checkEmailValidate(@RequestBody EmailVerifyNumber email) {
        String emailStatus = memberService.checkEmailValidate(email.getEmail());
        if (emailStatus.equals("invalid email")) { // 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } else if (emailStatus.equals("already signed in")) { // 409
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } else if (emailStatus.equals("already in verifying")) { // 406
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
        } else if (emailStatus.equals("valid email")) {
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.status(HttpStatus.GONE).build(); // 410
    }

    @PostMapping("/signup/email/send")
    public void sendEmail(@RequestBody EmailVerifyNumber email) {
        memberService.sendEmailVerifyNumber(email);
    }

    @PostMapping("/signup/verify/check")
    public ResponseEntity checkVerify(@RequestBody EmailVerifyNumber email) {
        if (memberService.checkVerifyNumber(email)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/signup/verify/delete/{email}")
    public ResponseEntity deleteVerify(@PathVariable String email) {
        if (memberService.deleteEmailVerifyNumber(email)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping("/{nickname}")
    public ResponseEntity checkNickname(@PathVariable String nickname) {
        if (memberService.checkNickname(nickname)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }
}
