/**
 * API types for Warehouse Management System
 *
 * Auto-generated from: http://localhost:8080/v3/api-docs
 * To regenerate: npm run generate:types (requires backend running)
 */

// ─── Shared wrapper ──────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// ─── Enums ────────────────────────────────────────────────────────────────────

export type BlockType = 'PALLET' | 'SHELF' | 'BIN' | 'RACK' | 'FLOOR';

export type UserRole = 'ADMIN' | 'MANAGER' | 'PICKER' | 'VIEWER';

export type ShipmentStatus =
  | 'CREATED'
  | 'PICKED'
  | 'PACKED'
  | 'READY_TO_DISPATCH'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'FAILED'
  | 'RETURNED';

export type ShipperType = 'INTERNAL' | 'THIRD_PARTY';

export type ServiceLevel = 'SAME_DAY' | 'NEXT_DAY' | 'STANDARD';

export type SystemStatus = 'OPTIMAL' | 'STRESSED' | 'CRITICAL';

export type CongestionLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type PickerStatus = 'IDLE' | 'ACTIVE' | 'OVERLOADED';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'CRITICAL';

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface BlockRoomInfo {
  roomId: string;
  name: string;
}

export interface BlockResponse {
  blockId: string;
  height: number;
  length: number;
  breath: number;
  type: BlockType;
  room: BlockRoomInfo;
}

export interface RoomResponse {
  roomId: string;
  name: string;
  blocks: BlockResponse[] | null;
}

export interface WareHouseResponse {
  warehouseId: string;
  name: string;
  city: string;
  address: string;
  landmark: string;
  rooms: RoomResponse[] | null;
}

export interface UserResponse {
  userId: string;
  username: string;
  email: string;
  userRole: string;
  createdAt: number;
  lastModifiedAt: number;
  warehouse: WareHouseResponse | null;
  mobile: string | null;
  profileImage: string | null;
}

export interface ProductResponse {
  productId: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  unitPrice: number;
  weight: number;
  dimensions: string;
  createdAt: number;
  lastModifiedAt: number;
}

export interface InventoryResponse {
  inventoryId: string;
  product: ProductResponse;
  blockId: string;
  blockName: string;
  quantity: number;
  reservedQuantity: number;
  damagedQuantity: number;
  availableQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  isLowStock: boolean;
  createdAt: number;
  lastModifiedAt: number;
}

export interface PickTaskResponse {
  taskId: string;
  orderId: string;
  orderNumber: string;
  product: ProductResponse;
  blockId: string;
  blockName: string;
  quantity: number;
  assignedTo: string;
  status: string;
  notes: string;
  createdAt: number;
  lastModifiedAt: number;
  completedAt: number | null;
}

export interface OrderResponse {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  status: string;
  totalItems: number;
  notes: string;
  pickTasks: PickTaskResponse[];
  createdAt: number;
  lastModifiedAt: number;
  pickedAt: number | null;
  packedAt: number | null;
  dispatchedAt: number | null;
}

export interface ShipmentResponse {
  shipmentId: string;
  shipmentCode: string;
  orderId: string;
  shipperId: string | null;
  shipperName: string | null;
  warehouseId: string;
  status: ShipmentStatus;
  trackingNumber: string | null;
  createdAt: string;       // Instant serialized as ISO string
  dispatchedAt: string | null;
  deliveredAt: string | null;
}

export interface ShipperResponse {
  shipperId: string;
  name: string;
  type: ShipperType;
  serviceLevel: ServiceLevel;
  trackingUrlTemplate: string | null;
  contactDetails: string | null;
  active: boolean;
  createdAt: string;
  lastModifiedAt: string;
}

export interface VehicleResponse {
  vehicleId: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  shipperId: string;
  lastLatitude: number | null;
  lastLongitude: number | null;
  lastUpdatedAt: string | null;
  active: boolean;
}

export interface StockMovementResponse {
  movementId: string;
  product: ProductResponse;
  fromBlockId: string;
  fromBlockName: string;
  toBlockId: string;
  toBlockName: string;
  quantity: number;
  movementType: string;
  referenceType: string;
  referenceId: string;
  notes: string;
  createdBy: string;
  createdAt: number;
}

export interface SystemHealthResponse {
  apiLatencyMs: number;
  webSocketSessions: number;
  lastInventorySyncTime: number;
  stuckOrdersCount: number;
  systemStatus: SystemStatus;
}

// ─── Analytics Response DTOs ──────────────────────────────────────────────────

export interface StockTurnoverResponse {
  productId: string;
  productName: string;
  totalMovements: number;
  turnoverRate: number;
}

export interface BlockUtilizationResponse {
  blockId: string;
  blockName: string;
  occupancyPercentage: number;
  utilizationLevel: string;
}

export interface FulfillmentMetricsResponse {
  avgPickTimeMinutes: number;
  avgPackTimeMinutes: number;
  avgDispatchTimeMinutes: number;
  avgTotalFulfillmentTimeMinutes: number;
}

export interface ShipmentMetricsResponse {
  totalShipments: number;
  shipmentsInTransit: number;
  deliveredToday: number;
  failedShipments: number;
}

export interface InventoryAgingResponse {
  inventoryId: string;
  productName: string;
  blockName: string;
  quantity: number;
  daysInWarehouse: number;
}

export interface ProcessAgingResponse {
  orderId: string;
  orderNumber: string;
  status: string;
  hoursInState: number;
}

export interface PickHeatmapResponse {
  blockId: string;
  blockName: string;
  activePicksCount: number;
  congestionLevel: CongestionLevel;
}

export interface PickerWorkloadResponse {
  username: string;
  activeTaskCount: number;
  completedTodayCount: number;
  status: PickerStatus;
}

export interface StockConfidenceResponse {
  productId: string;
  productName: string;
  confidenceScore: number;
  confidenceLevel: ConfidenceLevel;
  reason: string;
}

export interface ShipmentRiskResponse {
  shipmentId: string;
  trackingNumber: string;
  riskLevel: RiskLevel;
  probabilityOfDelay: number;
  detectedIssue: string;
}

export interface DashboardSummaryResponse {
  shipmentMetrics: ShipmentMetricsResponse;
  fulfillmentMetrics: FulfillmentMetricsResponse;
  topMovers: StockTurnoverResponse[];
  highUtilizationBlocks: BlockUtilizationResponse[];
  agingInventory: InventoryAgingResponse[];
  stuckOrders: ProcessAgingResponse[];
  pickHeatmap: PickHeatmapResponse[];
  pickerWorkload: PickerWorkloadResponse[];
  stockConfidence: StockConfidenceResponse[];
  shipmentRisk: ShipmentRiskResponse[];
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface UserRegistrationRequest {
  username: string;
  email: string;
  password: string;
  userRole: string;
  mobile?: string;
  profileImage?: string;
}

export interface UserRequest {
  username?: string;
  email?: string;
  mobile?: string;
  profileImage?: string;
  userRole?: string;
  warehouseId?: string;
}

export interface AdminUserUpdateRequest {
  username?: string;
  email?: string;
  mobile?: string;
  profileImage?: string;
  userRole?: string;
  warehouseId?: string;
}

export interface WareHouseRequest {
  name: string;
  city: string;
  address: string;
  landmark: string;
}

export interface RoomRequest {
  name: string;
}

export interface BlockRequest {
  height: number;
  length: number;
  breath: number;
  type: BlockType;
}

export interface ProductRequest {
  name: string;
  description?: string;
  sku: string;
  category?: string;
  unitPrice?: number;
  weight?: number;
  dimensions?: string;
}

export interface InventoryRequest {
  productId: string;
  blockId: string;
  quantity: number;
  minStockLevel?: number;
  maxStockLevel?: number;
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
}

export interface OrderRequest {
  customerName: string;
  customerEmail?: string;
  shippingAddress?: string;
  notes?: string;
  items: OrderItemRequest[];
}

export interface PickTaskAssignmentRequest {
  assignedTo: string;
}

export interface ShipmentItemRequest {
  productId: string;
  blockId: string;
  quantity: number;
}

export interface CreateShipmentRequest {
  orderId: string;
  shipperId?: string;
  warehouseId: string;
  trackingNumber?: string;
  items?: ShipmentItemRequest[];
}

export interface ShipperRequest {
  name: string;
  type: ShipperType;
  serviceLevel: ServiceLevel;
  trackingUrlTemplate?: string;
  contactDetails?: string;
}

export interface StockMovementRequest {
  productId: string;
  fromBlockId?: string;
  toBlockId?: string;
  quantity: number;
  movementType: string;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
}

export interface VehicleRequest {
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  shipperId?: string;
  capacity?: number;
}
