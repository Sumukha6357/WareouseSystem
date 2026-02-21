-- Add warehouse_id to block (denormalization for easier isolation)
ALTER TABLE block ADD COLUMN warehouse_id VARCHAR(255);
CREATE INDEX idx_block_warehouse_id ON block (warehouse_id);
ALTER TABLE block ADD CONSTRAINT fk_block_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouse (warehouse_id);

-- Add warehouse_id to inventory
ALTER TABLE inventory ADD COLUMN warehouse_id VARCHAR(255);
CREATE INDEX idx_inventory_warehouse_id ON inventory (warehouse_id);
ALTER TABLE inventory ADD CONSTRAINT fk_inventory_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouse (warehouse_id);

-- Add warehouse_id to orders
ALTER TABLE orders ADD COLUMN warehouse_id VARCHAR(255);
CREATE INDEX idx_orders_warehouse_id ON orders (warehouse_id);
ALTER TABLE orders ADD CONSTRAINT fk_orders_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouse (warehouse_id);

-- Add warehouse_id to pick_task
ALTER TABLE pick_task ADD COLUMN warehouse_id VARCHAR(255);
CREATE INDEX idx_pick_task_warehouse_id ON pick_task (warehouse_id);
ALTER TABLE pick_task ADD CONSTRAINT fk_pick_task_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouse (warehouse_id);

-- Add FK and Index to existing warehouse_id in shipment
CREATE INDEX idx_shipment_warehouse_id ON shipment (warehouse_id);
ALTER TABLE shipment ADD CONSTRAINT fk_shipment_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouse (warehouse_id);

-- Add warehouse_id to stock_movement for analytics isolation
ALTER TABLE stock_movement ADD COLUMN warehouse_id VARCHAR(255);
CREATE INDEX idx_stock_movement_warehouse_id ON stock_movement (warehouse_id);
ALTER TABLE stock_movement ADD CONSTRAINT fk_stock_movement_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouse (warehouse_id);
