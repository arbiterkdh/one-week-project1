package com.oneweekproject1backend.domain.member;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Member {
    private Integer memberId;
    private String memberEmail;
    private String memberNickname;
    private String memberPassword;
    private LocalDateTime member_inserted;
    private LocalDateTime member_updated;
}
