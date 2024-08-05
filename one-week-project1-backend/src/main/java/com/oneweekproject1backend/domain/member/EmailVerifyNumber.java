package com.oneweekproject1backend.domain.member;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EmailVerifyNumber {
    private String email;
    private Integer verifyNumber;
    private LocalDateTime expired;
}
