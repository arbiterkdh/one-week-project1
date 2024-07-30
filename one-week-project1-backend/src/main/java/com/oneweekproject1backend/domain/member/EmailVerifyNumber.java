package com.oneweekproject1backend.domain.member;

import lombok.Data;

@Data
public class EmailVerifyNumber {
    private String email;
    private Integer verifyNumber;
}
