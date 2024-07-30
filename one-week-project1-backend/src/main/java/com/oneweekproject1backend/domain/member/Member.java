package com.oneweekproject1backend.domain.member;

import lombok.Data;

@Data
public class Member {
    private Integer memberId;
    private String memberEmail;
    private String memberNickname;
    private String memberPassword;
}
