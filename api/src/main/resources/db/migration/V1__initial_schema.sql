CREATE TABLE IF NOT EXISTS warehouse (
    warehouse_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    landmark VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS room (
    room_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    warehouse_id VARCHAR(255),
    CONSTRAINT fk_room_warehouse
        FOREIGN KEY (warehouse_id) REFERENCES warehouse (warehouse_id)
);

CREATE TABLE IF NOT EXISTS block (
    block_id VARCHAR(255) PRIMARY KEY,
    room_id VARCHAR(255),
    name VARCHAR(255),
    height DOUBLE PRECISION NOT NULL,
    length DOUBLE PRECISION NOT NULL,
    breath DOUBLE PRECISION NOT NULL,
    type INTEGER NOT NULL,
    CONSTRAINT block_type_check CHECK (type BETWEEN 0 AND 1),
    CONSTRAINT fk_block_room
        FOREIGN KEY (room_id) REFERENCES room (room_id)
);

CREATE TABLE IF NOT EXISTS recked (
    block_id VARCHAR(255) PRIMARY KEY,
    CONSTRAINT fk_recked_block
        FOREIGN KEY (block_id) REFERENCES block (block_id)
);

CREATE TABLE IF NOT EXISTS un_recked (
    block_id VARCHAR(255) PRIMARY KEY,
    CONSTRAINT fk_un_recked_block
        FOREIGN KEY (block_id) REFERENCES block (block_id)
);

CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_role INTEGER NOT NULL,
    mobile VARCHAR(255),
    profile_image VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT users_user_role_check CHECK (user_role BETWEEN 0 AND 7)
);

CREATE TABLE IF NOT EXISTS admin (
    user_id VARCHAR(255) PRIMARY KEY,
    warehouse_id VARCHAR(255),
    CONSTRAINT fk_admin_user
        FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_admin_warehouse
        FOREIGN KEY (warehouse_id) REFERENCES warehouse (warehouse_id)
);

CREATE TABLE IF NOT EXISTS staff (
    user_id VARCHAR(255) PRIMARY KEY,
    warehouse_id VARCHAR(255),
    CONSTRAINT fk_staff_user
        FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_staff_warehouse
        FOREIGN KEY (warehouse_id) REFERENCES warehouse (warehouse_id)
);

CREATE TABLE IF NOT EXISTS product (
    product_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    sku VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(255),
    unit_price DOUBLE PRECISION,
    weight DOUBLE PRECISION,
    dimensions VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_modified_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory (
    inventory_id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    block_id VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    reserved_quantity INTEGER,
    damaged_quantity INTEGER,
    min_stock_level INTEGER,
    max_stock_level INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_inventory_product
        FOREIGN KEY (product_id) REFERENCES product (product_id),
    CONSTRAINT fk_inventory_block
        FOREIGN KEY (block_id) REFERENCES block (block_id)
);

CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(255) PRIMARY KEY,
    order_number VARCHAR(255) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    shipping_address VARCHAR(255),
    status VARCHAR(255) NOT NULL,
    total_items INTEGER,
    notes VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    picked_at TIMESTAMP WITH TIME ZONE,
    packed_at TIMESTAMP WITH TIME ZONE,
    dispatched_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT orders_status_check
        CHECK (status IN ('PENDING', 'PICK_ASSIGNED', 'PICKED', 'PACKED', 'DISPATCHED', 'CANCELLED'))
);

CREATE TABLE IF NOT EXISTS pick_task (
    task_id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    block_id VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    assigned_to VARCHAR(255),
    status VARCHAR(255) NOT NULL,
    notes VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT pick_task_status_check
        CHECK (status IN ('ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    CONSTRAINT fk_pick_task_order
        FOREIGN KEY (order_id) REFERENCES orders (order_id),
    CONSTRAINT fk_pick_task_product
        FOREIGN KEY (product_id) REFERENCES product (product_id),
    CONSTRAINT fk_pick_task_block
        FOREIGN KEY (block_id) REFERENCES block (block_id)
);

CREATE TABLE IF NOT EXISTS shipper (
    shipper_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    service_level VARCHAR(255) NOT NULL,
    tracking_url_template VARCHAR(255),
    contact_details VARCHAR(255),
    active BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT shipper_type_check CHECK (type IN ('INTERNAL', 'THIRD_PARTY')),
    CONSTRAINT shipper_service_level_check CHECK (service_level IN ('SAME_DAY', 'NEXT_DAY', 'STANDARD'))
);

CREATE TABLE IF NOT EXISTS vehicle (
    vehicle_id VARCHAR(255) PRIMARY KEY,
    vehicle_number VARCHAR(255) NOT NULL UNIQUE,
    driver_name VARCHAR(255),
    driver_phone VARCHAR(255),
    shipper_id VARCHAR(255),
    last_latitude DOUBLE PRECISION,
    last_longitude DOUBLE PRECISION,
    last_updated_at TIMESTAMP WITH TIME ZONE,
    active BOOLEAN NOT NULL,
    CONSTRAINT fk_vehicle_shipper
        FOREIGN KEY (shipper_id) REFERENCES shipper (shipper_id)
);

CREATE TABLE IF NOT EXISTS shipment (
    shipment_id VARCHAR(255) PRIMARY KEY,
    shipment_code VARCHAR(255) NOT NULL UNIQUE,
    order_id VARCHAR(255) NOT NULL,
    shipper_id VARCHAR(255) NOT NULL,
    warehouse_id VARCHAR(255),
    status VARCHAR(255) NOT NULL,
    tracking_number VARCHAR(255),
    estimated_delivery_date DATE,
    notes VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    dispatched_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT shipment_status_check
        CHECK (status IN (
            'CREATED', 'PICKED', 'PACKED', 'READY_TO_DISPATCH',
            'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'RETURNED'
        )),
    CONSTRAINT fk_shipment_order
        FOREIGN KEY (order_id) REFERENCES orders (order_id),
    CONSTRAINT fk_shipment_shipper
        FOREIGN KEY (shipper_id) REFERENCES shipper (shipper_id)
);

CREATE TABLE IF NOT EXISTS shipment_item (
    shipment_item_id VARCHAR(255) PRIMARY KEY,
    shipment_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    block_id VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    CONSTRAINT fk_shipment_item_shipment
        FOREIGN KEY (shipment_id) REFERENCES shipment (shipment_id),
    CONSTRAINT fk_shipment_item_product
        FOREIGN KEY (product_id) REFERENCES product (product_id),
    CONSTRAINT fk_shipment_item_block
        FOREIGN KEY (block_id) REFERENCES block (block_id)
);

CREATE TABLE IF NOT EXISTS shipment_event (
    event_id VARCHAR(255) PRIMARY KEY,
    shipment_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    message VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT shipment_event_type_check
        CHECK (event_type IN (
            'PICKED', 'PACKED', 'LOADED', 'DISPATCHED',
            'LOCATION_UPDATE', 'DELIVERED', 'FAILED', 'RETURNED'
        )),
    CONSTRAINT fk_shipment_event_shipment
        FOREIGN KEY (shipment_id) REFERENCES shipment (shipment_id)
);

CREATE TABLE IF NOT EXISTS stock_movement (
    movement_id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    from_block_id VARCHAR(255),
    to_block_id VARCHAR(255),
    quantity INTEGER NOT NULL,
    movement_type VARCHAR(255) NOT NULL,
    reference_type VARCHAR(255),
    reference_id VARCHAR(255),
    notes VARCHAR(255),
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT stock_movement_type_check
        CHECK (movement_type IN ('INBOUND', 'PUTAWAY', 'PICK', 'TRANSFER', 'ADJUSTMENT', 'OUTBOUND')),
    CONSTRAINT fk_stock_movement_product
        FOREIGN KEY (product_id) REFERENCES product (product_id),
    CONSTRAINT fk_stock_movement_from_block
        FOREIGN KEY (from_block_id) REFERENCES block (block_id),
    CONSTRAINT fk_stock_movement_to_block
        FOREIGN KEY (to_block_id) REFERENCES block (block_id)
);

CREATE INDEX IF NOT EXISTS idx_room_warehouse_id ON room (warehouse_id);
CREATE INDEX IF NOT EXISTS idx_block_room_id ON block (room_id);
CREATE INDEX IF NOT EXISTS idx_admin_warehouse_id ON admin (warehouse_id);
CREATE INDEX IF NOT EXISTS idx_staff_warehouse_id ON staff (warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory (product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_block_id ON inventory (block_id);
CREATE INDEX IF NOT EXISTS idx_pick_task_order_id ON pick_task (order_id);
CREATE INDEX IF NOT EXISTS idx_pick_task_product_id ON pick_task (product_id);
CREATE INDEX IF NOT EXISTS idx_pick_task_block_id ON pick_task (block_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_shipper_id ON vehicle (shipper_id);
CREATE INDEX IF NOT EXISTS idx_shipment_order_id ON shipment (order_id);
CREATE INDEX IF NOT EXISTS idx_shipment_shipper_id ON shipment (shipper_id);
CREATE INDEX IF NOT EXISTS idx_shipment_item_shipment_id ON shipment_item (shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipment_item_product_id ON shipment_item (product_id);
CREATE INDEX IF NOT EXISTS idx_shipment_item_block_id ON shipment_item (block_id);
CREATE INDEX IF NOT EXISTS idx_shipment_event_shipment_id ON shipment_event (shipment_id);
CREATE INDEX IF NOT EXISTS idx_stock_movement_product_id ON stock_movement (product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movement_from_block_id ON stock_movement (from_block_id);
CREATE INDEX IF NOT EXISTS idx_stock_movement_to_block_id ON stock_movement (to_block_id);
