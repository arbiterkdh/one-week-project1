package com.oneweekproject1backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class OneWeekProject1BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(OneWeekProject1BackendApplication.class, args);
    }

}
