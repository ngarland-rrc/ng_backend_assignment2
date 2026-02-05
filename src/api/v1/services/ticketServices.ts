import { Ticket } from "../models/ticketModel";
import { urgencyResponse } from "../models/urgencyResponseModel";
import { mockTickets } from "../../../data/ticketdata";

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

    const lastId: number = mockTickets.length ? mockTickets[mockTickets.length - 1].id : 0;
    const newId: number = lastId + 1

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
        throw new Error("Ticket not found");
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
        throw new Error("Ticket not found");
    }

    mockTickets.splice(index, 1);
};

/**
 * Retrieves a ticket from storage
 * @param id - The ID of the ticket to be retrieved
 * @returns - The matching ticket
 * @throws - Error if ticket with given ID is not found
 */
export const getTicketById = async (id: number): Promise<Ticket> => {
    const index: number = mockTickets.findIndex((ticket: Ticket) => ticket.id === id);

    if (index === -1) {
        throw new Error("Ticket not found");
    }

    return structuredClone(mockTickets[index])
};

/**
 * Calculates and returns the urgencyResponse object
 * @param id - The ID of the ticket to be calculated
 * @returns - The calculated urgencyResponse
 * @throws - Error if ticket with ID is not found
 */
export const getTicketUrgencyScore = async (id: number): Promise<urgencyResponse> => {
    const index: number = mockTickets.findIndex((ticket: Ticket) => ticket.id === id);

    if (index === -1) {
        throw new Error("Ticket not found");
    }

    const priorityScores: { [key in "critical" | "high" | "medium" | "low"]: number } = {
        critical: 50,
        high: 30,
        medium: 20,
        low: 10,
    };

    const { title, priority, status, createdAt } = mockTickets[index];

    const ticketAge: number = Math.round((new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));

    let urgencyScore: number = Math.round(priorityScores[priority as "critical" | "high" | "medium" | "low"] + (ticketAge * 5));


    let urgencyLevel: string = "New";

    switch (true) {
        case status === "resolved":
            urgencyScore = 0
            urgencyLevel = "Minimal, Ticket resolved.";
            break;
        case urgencyScore >= 80:
            urgencyLevel = "Critical. Immediate attention required.";
            break;
        case urgencyScore >= 55:
            urgencyLevel = "High urgency. Prioritize resolution.";
            break;
        case urgencyScore >= 30:
            urgencyLevel = "Moderate. Schedule for attention.";
            break;
        case urgencyScore > 0:
            urgencyLevel = "Low urgency. Address when capacity allows.";
    }


    const response: urgencyResponse = {
        id: id,
        title: title,
        priority: priority,
        status: status,
        createdAt: createdAt,
        ticketAge: ticketAge,
        urgencyScore: urgencyScore,
        urgencyLevel: urgencyLevel,
    }

    return response
}