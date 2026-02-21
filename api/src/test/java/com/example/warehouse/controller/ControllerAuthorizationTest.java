package com.example.warehouse.controller;

import com.example.warehouse.dto.response.PickTaskResponse;
import com.example.warehouse.dto.response.WareHouseResponse;
import com.example.warehouse.repository.UserRepository;
import com.example.warehouse.security.SecurityConfig;
import com.example.warehouse.service.impl.SystemStatusService;
import com.example.warehouse.service.contract.OrderService;
import com.example.warehouse.service.contract.ShipmentService;
import com.example.warehouse.service.contract.VehicleService;
import com.example.warehouse.service.contract.WareHouseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest({ WareHouseController.class, OrderController.class, ShipmentController.class, VehicleController.class })
@Import(SecurityConfig.class)
class ControllerAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WareHouseService wareHouseService;

    @MockBean
    private OrderService orderService;

    @MockBean
    private ShipmentService shipmentService;

    @MockBean
    private VehicleService vehicleService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private SystemStatusService systemStatusService;

    @MockBean
    private JpaMetamodelMappingContext jpaMetamodelMappingContext;

    @BeforeEach
    void setUp() {
        Mockito.when(wareHouseService.findAllWareHouses()).thenReturn(List.<WareHouseResponse>of());
        Mockito.when(orderService.getPickTasksByPicker(anyString())).thenReturn(List.<PickTaskResponse>of());
        Mockito.when(shipmentService.getAllShipments()).thenReturn(List.of());
    }

    @Test
    @WithMockUser(authorities = "STAFF")
    void staffShouldBeForbiddenOnAdminOnlyEndpoint() throws Exception {
        mockMvc.perform(get("/warehouses"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void adminShouldAccessAdminEndpoint() throws Exception {
        mockMvc.perform(get("/warehouses"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = "PICKER")
    void pickerShouldBeForbiddenOnOrdersListing() throws Exception {
        mockMvc.perform(get("/orders"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = "PICKER")
    void pickerShouldAccessPickTasksEndpoint() throws Exception {
        mockMvc.perform(get("/orders/pick-tasks/picker/picker-1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = "EXTERNAL_SHIPPER")
    void shipperShouldAccessShipmentEndpoints() throws Exception {
        mockMvc.perform(get("/shipments/all"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = "EXTERNAL_SHIPPER")
    void shipperShouldBeForbiddenOnNonShipmentEndpoints() throws Exception {
        mockMvc.perform(get("/vehicles"))
                .andExpect(status().isForbidden());
    }
}
