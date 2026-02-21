package com.example.warehouse.config;

public class WarehouseContext {
    private static final ThreadLocal<String> CURRENT_WAREHOUSE = new ThreadLocal<>();

    public static void setWarehouseId(String warehouseId) {
        CURRENT_WAREHOUSE.set(warehouseId);
    }

    public static String getWarehouseId() {
        return CURRENT_WAREHOUSE.get();
    }

    public static void clear() {
        CURRENT_WAREHOUSE.remove();
    }
}
