package com.example.warehouse.util;

import org.springframework.beans.BeanWrapperImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public final class PageUtils {

    private PageUtils() {
    }

    public static <T> Page<T> paginate(List<T> source, Pageable pageable) {
        if (source == null) {
            return Page.empty(pageable);
        }

        List<T> sorted = applySort(source, pageable.getSort());
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), sorted.size());

        if (start > end) {
            return new PageImpl<>(List.of(), pageable, sorted.size());
        }
        return new PageImpl<>(sorted.subList(start, end), pageable, sorted.size());
    }

    public static <T> com.example.warehouse.dto.wrapper.PageResponse<T> toPageResponse(Page<T> page) {
        return com.example.warehouse.dto.wrapper.PageResponse.<T>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    private static <T> List<T> applySort(List<T> source, Sort sort) {
        if (sort == null || sort.isUnsorted()) {
            return source;
        }
        List<T> copy = new ArrayList<>(source);
        Comparator<T> comparator = null;
        for (Sort.Order order : sort) {
            Comparator<T> current = Comparator.comparing(
                    item -> (Comparable<Object>) readProperty(item, order.getProperty()),
                    Comparator.nullsLast(Comparator.naturalOrder()));
            if (order.getDirection().isDescending()) {
                current = current.reversed();
            }
            comparator = comparator == null ? current : comparator.thenComparing(current);
        }
        if (comparator != null) {
            copy.sort(comparator);
        }
        return copy;
    }

    private static Object readProperty(Object bean, String property) {
        try {
            return new BeanWrapperImpl(bean).getPropertyValue(property);
        } catch (Exception ignored) {
            return null;
        }
    }
}

