import { Ticket } from "../models/ticketModel";
import { mockTickets } from "src/data/ticketdata";


/**
 * Retrieves all tickets from storage
 * @returns Array of all tickets
 */
export const getAllTickets = async (): Promise<Ticket[]> => {
    return structuredClone(mockTickets);
};

/**
 * Creates a new ticket
 * @param ticketData - The data for the new ticket (title, description, priority, and status)
 * @returns The created ticket with generated ID
 */
export const createTicket = async (ticketData: {
    title: string;
    description: string;
    priority: string;
    status: string;
}): Promise<Ticket> => {

    const lastId = mockTickets.length ? mockTickets[mockTickets.length - 1].id : 0;
    const newId = lastId + 1

    const newTicket: Ticket = {
        id: newId,
        title: ticketData.title,
        description: ticketData.description,
        priority: ticketData.priority,
        status: ticketData.status,
        createdAt: new Date(),
    };

    mockTickets.push(newTicket);

    return structuredClone(newTicket);
};

/**
 * Updates (replaces) an existing item
 * @param id - The ID of the item to update
 * @param ticketData - The fields to updates (name and/or description)
 * @returns The updated item
 * @throws Error if item with given ID is not found
 */
export const updateItem = async (
    id: string,
    ticketData: Pick<Ticket, "name" | "description">
): Promise<Ticket> => {
    const index: number = tickets.findIndex((item: Ticket) => item.id === id);

    if (index === -1) {
        throw new Error(`Ticket with ID ${id} not found`);
    }

    tickets[index] = {
        ...tickets[index],
        ...ticketData,
        updatedAt: new Date(),
    };

    return structuredClone(tickets[index]);
};

/**
 * Deletes an item from storage
 * @param id - The ID of the item to delete
 * @throws Error if item with given ID is not found
 */
export const deleteItem = async (id: string): Promise<void> => {
    const index: number = tickets.findIndex((item: Ticket) => item.id === id);

    if (index === -1) {
        throw new Error(`Ticket with ID ${id} not found`);
    }

    tickets.splice(index, 1);
};