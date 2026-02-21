package com.example.warehouse.repository.specification;

import com.example.warehouse.entity.BaseEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class SpecificationBuilder<T extends BaseEntity> {
    private final List<Specification<T>> specifications = new ArrayList<>();

    public SpecificationBuilder() {
        // ALWAYS exclude deleted records by default
        specifications.add(BaseSpecification.isNotDeleted());
    }

    public SpecificationBuilder<T> with(Specification<T> spec) {
        if (spec != null) {
            specifications.add(spec);
        }
        return this;
    }

    public Specification<T> build() {
        if (specifications.isEmpty()) {
            return null;
        }

        Specification<T> result = specifications.get(0);
        for (int i = 1; i < specifications.size(); i++) {
            result = Specification.where(result).and(specifications.get(i));
        }
        return result;
    }
}
