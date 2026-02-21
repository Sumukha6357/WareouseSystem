package com.example.warehouse.exception;

public class UserNotFoundByEmail extends RuntimeException {
    public UserNotFoundByEmail(String message) {
        super(message);
    }
}
