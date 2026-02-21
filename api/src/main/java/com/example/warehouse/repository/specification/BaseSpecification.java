package com.example.warehouse.repository.specification;

import com.example.warehouse.entity.BaseEntity;
import org.springframework.data.jpa.domain.Specification;

public class BaseSpecification {
    public static <T extends BaseEntity> Specification<T> isNotDeleted() {
        return (root, query, cb) -> cb.equal(root.get("deleted"), false);
    }
}
