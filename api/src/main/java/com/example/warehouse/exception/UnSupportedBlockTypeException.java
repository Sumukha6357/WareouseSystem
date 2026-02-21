package com.example.warehouse.exception;

public class UnSupportedBlockTypeException extends RuntimeException {
    public UnSupportedBlockTypeException(String message) {
        super(message);
    }
}
