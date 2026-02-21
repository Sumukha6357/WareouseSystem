import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InventoryForm from '../InventoryForm';

const mockProducts = [
    { productId: 'p1', name: 'Product 1', sku: 'SKU-001' },
    { productId: 'p2', name: 'Product 2', sku: 'SKU-002' },
];

const mockBlocks = [
    { blockId: 'b1', room: { roomId: 'r1', name: 'Room 1' } },
    { blockId: 'b2', room: { roomId: 'r2', name: 'Room 2' } },
];

describe('InventoryForm', () => {
    it('renders all form fields', () => {
        render(
            <InventoryForm
                products={mockProducts}
                blocks={mockBlocks}
                onSubmit={() => { }}
                onClose={() => { }}
            />
        );

        expect(screen.getByLabelText(/Product Resource/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Storage Node Terminal/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Initial Payload/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Safety Threshold/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Operational Limit/i)).toBeInTheDocument();
    });

    it('submits the form with correct data', () => {
        const handleSubmit = vi.fn();
        render(
            <InventoryForm
                products={mockProducts}
                blocks={mockBlocks}
                onSubmit={handleSubmit}
                onClose={() => { }}
            />
        );

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/Product Resource/i), { target: { value: 'p1' } });
        fireEvent.change(screen.getByLabelText(/Storage Node Terminal/i), { target: { value: 'b1' } });
        fireEvent.change(screen.getByLabelText(/Initial Payload/i), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText(/Safety Threshold/i), { target: { value: '10' } });
        fireEvent.change(screen.getByLabelText(/Operational Limit/i), { target: { value: '500' } });

        // Submit the form
        fireEvent.click(screen.getByText(/Initialize Node Link/i));

        expect(handleSubmit).toHaveBeenCalledWith({
            productId: 'p1',
            blockId: 'b1',
            quantity: 100,
            minStockLevel: 10,
            maxStockLevel: 500
        });
    });

    it('pre-fills data when editing', () => {
        const editingInventory = {
            inventoryId: 'inv-1',
            product: mockProducts[0],
            blockId: 'b1',
            quantity: 50,
            minStockLevel: 5,
            maxStockLevel: 200
        };

        render(
            <InventoryForm
                products={mockProducts}
                blocks={mockBlocks}
                editingInventory={editingInventory}
                onSubmit={() => { }}
                onClose={() => { }}
            />
        );

        expect(screen.getByLabelText(/Product Resource/i)).toHaveValue('p1');
        expect(screen.getByLabelText(/Storage Node Terminal/i)).toHaveValue('b1');
        expect(screen.getByLabelText(/Initial Payload/i)).toHaveValue(50);
        expect(screen.getByText(/Finalize Logic Update/i)).toBeInTheDocument();
    });

    it('calls onClose when Abort is clicked', () => {
        const handleClose = vi.fn();
        render(
            <InventoryForm
                products={mockProducts}
                blocks={mockBlocks}
                onSubmit={() => { }}
                onClose={handleClose}
            />
        );

        fireEvent.click(screen.getByText(/Abort Operation/i));
        expect(handleClose).toHaveBeenCalled();
    });
});
