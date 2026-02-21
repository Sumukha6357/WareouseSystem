package com.example.warehouse.repository;

import com.example.warehouse.entity.Block;
import com.example.warehouse.entity.Inventory;
import com.example.warehouse.entity.Order;
import com.example.warehouse.entity.Product;
import com.example.warehouse.entity.Room;
import com.example.warehouse.entity.WareHouse;
import com.example.warehouse.entity.PickTask;
import com.example.warehouse.enums.BlockType;
import com.example.warehouse.support.AbstractIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.OptimisticLockingFailureException;

import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
class InventoryOptimisticLockIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BlockRepository blockRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private WareHouseRepository wareHouseRepository;

    @Autowired
    private PickTaskRepository pickTaskRepository;

    @Autowired
    private OrderRepository orderRepository;

    @BeforeEach
    void cleanUp() {
        pickTaskRepository.deleteAll();
        orderRepository.deleteAll();
        inventoryRepository.deleteAll();
        blockRepository.deleteAll();
        roomRepository.deleteAll();
        wareHouseRepository.deleteAll();
        productRepository.deleteAll();
    }

    @Test
    void staleInventoryUpdate_throwsOptimisticLockingFailure() {
        Inventory persisted = inventoryRepository.saveAndFlush(buildInventory());

        Inventory snapshotA = inventoryRepository.findById(persisted.getInventoryId()).orElseThrow();
        Inventory snapshotB = inventoryRepository.findById(persisted.getInventoryId()).orElseThrow();

        snapshotA.setQuantity(150);
        inventoryRepository.saveAndFlush(snapshotA);

        snapshotB.setQuantity(175);
        assertThrows(
                OptimisticLockingFailureException.class,
                () -> inventoryRepository.saveAndFlush(snapshotB));
    }

    private Inventory buildInventory() {
        WareHouse wareHouse = new WareHouse();
        wareHouse.setName("Test Warehouse");
        wareHouse.setCity("Austin");
        wareHouse.setAddress("100 Supply Chain Rd");
        wareHouse.setLandmark("Dock A");
        WareHouse savedWarehouse = wareHouseRepository.save(wareHouse);

        Room room = new Room();
        room.setName("Room A");
        room.setWarehouse(savedWarehouse);
        Room savedRoom = roomRepository.save(room);

        Block block = new Block();
        block.setName("Block A1");
        block.setRoom(savedRoom);
        block.setHeight(20.0);
        block.setLength(20.0);
        block.setBreath(20.0);
        block.setType(BlockType.UNRECKED);
        Block savedBlock = blockRepository.save(block);

        Product product = new Product();
        product.setName("Test Product");
        product.setSku("SKU-LOCK-001");
        product.setCategory("TEST");
        product.setUnitPrice(10.0);
        Product savedProduct = productRepository.save(product);

        Inventory inventory = new Inventory();
        inventory.setProduct(savedProduct);
        inventory.setBlock(savedBlock);
        inventory.setQuantity(120);
        inventory.setReservedQuantity(0);
        inventory.setDamagedQuantity(0);
        inventory.setMinStockLevel(10);
        inventory.setMaxStockLevel(500);
        return inventory;
    }
}
