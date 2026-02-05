import { Ticket } from "../models/ticketModel";
import { mockTickets } from "src/data/ticketdata";

/**
 * Retrieves all mockTickets from storage
 * @returns Array of all mockTickets
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
 * Updates an existing ticket
 * @param id - The ID of the ticket to update
 * @param ticketData - The fields to updates (priority and/or status)
 * @returns The updated ticket
 * @throws Error if ticket with given ID is not found
 */
export const updateTicket = async (
    id: number,
    ticketData: Pick<Ticket, "priority" | "status">
): Promise<Ticket> => {
    const index: number = mockTickets.findIndex((ticket: Ticket) => ticket.id === id);

    if (index === -1) {
        throw new Error(`Ticket with ID ${id} not found`);
    }

    mockTickets[index] = {
        ...mockTickets[index],
        ...ticketData,
    };

    return structuredClone(mockTickets[index]);
};

/**
 * Deletes an ticket from storage
 * @param id - The ID of the ticket to delete
 * @throws Error if ticket with given ID is not found
 */
export const deleteTicket = async (id: number): Promise<void> => {
    const index: number = mockTickets.findIndex((ticket: Ticket) => ticket.id === id);

    if (index === -1) {
        throw new Error(`Ticket with ID ${id} not found`);
    }

    mockTickets.splice(index, 1);
};

/**
 * 
 * @param id - The ID of the ticket to be retrieved
 * @returns - The matching ticket
 * @throws - Error if ticket with given ID is not found
 */
export const getTicketById = async (id: number): Promise<Ticket> => {
    const index: number = mockTickets.findIndex((tickets: Ticket) => tickets.id === id);

    if (index === -1) {
        throw new Error(`Ticket with ID ${id} not found`);
    }

    return structuredClone(mockTickets[index])
}