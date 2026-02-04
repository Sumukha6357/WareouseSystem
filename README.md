# Warehouse Management System

A comprehensive, full-stack Warehouse Management System (WMS) built to streamline inventory tracking, order fulfillment, and shipment management.

## 🚀 Features

*   **Inventory Management**: Real-time tracking of stock across multiple warehouses and storage blocks.
*   **Order Fulfillment**: End-to-end workflow from Order Creation -> Picking -> Packing -> Dispatch.
*   **Picker Tasks**: Mobile-friendly view for staff to receive and complete picking assignments.
*   **Shipment Tracking**: Manage carriers (Shippers) and track outbound shipments with status updates.
*   **Real-time Analytics**: Live dashboards showing stock turnover, fulfillment times, and block utilization.
*   **Role-Based Access**: Secure access for Admin, Staff, and Drivers.

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
