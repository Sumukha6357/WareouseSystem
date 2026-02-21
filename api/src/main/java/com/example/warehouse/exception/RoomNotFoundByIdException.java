package com.example.warehouse.exception;

public class RoomNotFoundByIdException extends RuntimeException {
    public RoomNotFoundByIdException(String message) {
        super(message);
    }
}
