package com.example.warehouse.controller.exception.handler;

import java.time.Instant;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.warehouse.dto.wrapper.ApiErrorResponse;
import com.example.warehouse.exception.ResourceNotFoundException;
import com.example.warehouse.exception.IllegalOperationException;
import com.example.warehouse.exception.RoomNotFoundByIdException;
import com.example.warehouse.exception.UnSupportedBlockTypeException;
import com.example.warehouse.exception.UserNotFoundByEmail;
import com.example.warehouse.exception.UserNotFoundByIdException;
import com.example.warehouse.exception.WareHouseNotFindByIdException;

import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.OptimisticLockException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        String fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        String globalErrors = ex.getBindingResult()
                .getGlobalErrors()
                .stream()
                .map(error -> error.getObjectName() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        String message = String.join(", ",
                java.util.List.of(fieldErrors, globalErrors).stream().filter(s -> s != null && !s.isBlank()).toList());

        if (message.isBlank()) {
            message = "Validation failed";
        }

        return buildError(HttpStatus.BAD_REQUEST, message, request.getRequestURI());
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolationException(
            ConstraintViolationException ex,
            HttpServletRequest request) {
        String message = ex.getConstraintViolations().stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .collect(Collectors.joining(", "));
        if (message.isBlank()) {
            message = "Validation failed";
        }
        return buildError(HttpStatus.BAD_REQUEST, message, request.getRequestURI());
    }

    @ExceptionHandler({
            EntityNotFoundException.class,
            ResourceNotFoundException.class,
            RoomNotFoundByIdException.class,
            UserNotFoundByIdException.class,
            UserNotFoundByEmail.class,
            WareHouseNotFindByIdException.class,
            UnSupportedBlockTypeException.class,
            IllegalOperationException.class
    })
    public ResponseEntity<ApiErrorResponse> handleEntityNotFound(
            RuntimeException ex,
            HttpServletRequest request) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDenied(
            AccessDeniedException ex,
            HttpServletRequest request) {
        return buildError(HttpStatus.FORBIDDEN, ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler({ OptimisticLockException.class, ObjectOptimisticLockingFailureException.class })
    public ResponseEntity<ApiErrorResponse> handleOptimisticLock(
            RuntimeException ex,
            HttpServletRequest request) {
        return buildError(
                HttpStatus.CONFLICT,
                "Concurrent update detected. Please refresh and retry.",
                request.getRequestURI());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(
            Exception ex,
            HttpServletRequest request) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), request.getRequestURI());
    }

    private ResponseEntity<ApiErrorResponse> buildError(HttpStatus status, String message, String path) {
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                path);
        return ResponseEntity.status(status).body(body);
    }
}
