package com.example.warehouse.exception;

public class WareHouseNotFindByIdException extends RuntimeException {
    public WareHouseNotFindByIdException(String message) {
        super(message);
    }
}
