# Warehouse Management System

A comprehensive, full-stack Warehouse Management System (WMS) built to streamline inventory tracking, order fulfillment, and shipment management.

## 🚀 Features

*   **Inventory Logistics**: Real-time tracking of stock across multiple warehouses and storage blocks with strict **Capacity Guard** enforcement.
*   **Predictive Intelligence**: AI-driven **Stock Confidence** scoring and **Shipment Risk** radar to proactively identify stock inaccuracies and fulfillment delays.
*   **Spatial Awareness**: Interactive **Warehouse Heatmaps** visualizing active picks, spatial congestion, and storage utilization.
*   **Operational Observability**: Real-time system health dashboard showing **API Latency**, WebSocket session stability, and fulfillment bottlenecks.
*   **Advanced Fulfillment**: End-to-end workflow (Pick -> Pack -> Dispatch) with strict sequencing and **Team Pulse** productivity tracking.
*   **Enterprise Security**: Robust Role-Based Access Control (RBAC) with 7+ granular roles (Warehouse Manager, Picker, Packer, Supervisor, Auditor, etc.).
*   **Rich Activity Feed**: Live audit trails of all stock movements and staff activities for total transparency.

## 🛠 Tech Stack

**Frontend (`Warehouse-f`)**
*   **Framework**: Next.js 14 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS, Lucide Icons
*   **State/Data**: Axios, React Hooks

**Backend (`Warehouse-b`)**
*   **Framework**: Spring Boot 3
*   **Language**: Java 17+
*   **Database**: MySQL (Hibernate/JPA)
*   **Security**: Spring Security (JWT)
*   **Documentation**: Swagger UI

## 📂 Project Structure

This is a Monorepo containing both the backend and frontend applications:

*   `/Warehouse-b`: Spring Boot Backend Application
*   `/Warehouse-f`: Next.js Frontend Application

## 🏁 Getting Started

### Prerequisites
*   Node.js 18+
*   Java JDK 17+
*   MySQL Server

### Backend Setup
1.  Navigate to `Warehouse-b`.
2.  Update `src/main/resources/application.properties` with your MySQL credentials.
3.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```

### Frontend Setup
1.  Navigate to `Warehouse-f`.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:3000` in your browser.

## 👥 Authors
*   Sumukha KY
