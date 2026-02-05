import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as ticketServices from "../services/ticketServices";
import type { Ticket } from "../models/ticketModel";

const allowedPriorities = ["critical", "high", "medium", "low"];
const allowedStatus = ["open", "in-progress", "resolved"];

export const getAllTickets = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const tickets: Ticket[] = await ticketServices.getAllTickets();
        res.status(HTTP_STATUS.OK).json({
            message: "Tickets retrieved",
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        next(error);
    }
};

export const createTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {

        if (!req.body.title) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Ticket title is required",
            });
        }
        else if (!req.body.description) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Ticket description is required",
            });

        } else if (!allowedPriorities.includes(req.body.priority)) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: `Invalid priority. Must be one of: ${allowedPriorities.join(", ")}`,
            });
        } else {
            // Extract only the fields we need
            const { title, description, priority } = req.body;
            const eventData = { title, description, priority };

            const newTicket: Ticket = await ticketServices.createTicket(eventData);
            res.status(HTTP_STATUS.CREATED).json({
                message: "Ticket created successfully",
                data: newTicket,
            });
        }
    } catch (error) {
        next(error);
    }
};

export const updateTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {

        if (!allowedPriorities.includes(req.body.priority)) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: `Invalid priority. Must be one of: ${allowedPriorities.join(", ")}`,
            });
        }
        else if (!allowedStatus.includes(req.body.status)) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: `Invalid priority. Must be one of: ${allowedStatus.join(", ")}`,
            });


        } else {

            const { id } = req.params;

            // Extract update fields
            const { priority, status } = req.body;

            // Create update data object with only the fields that can be updated
            const updateData = { priority, status };

            const updatedTicket: Ticket = await ticketServices.updateTicket((id), updateData);
            res.status(HTTP_STATUS.OK).json({
                message: "Ticket updated successfully",
                data: updatedTicket,
            });
        }
    } catch (error) {
        next(error);
    }
};

export const deleteEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        await ticketServices.deleteEvent(id);
        res.status(HTTP_STATUS.OK).json({
            message: "Ticket deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getEventById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { title } = req.params;
        const event: Ticket = await ticketServices.getEventById(Number(title));
        res.status(HTTP_STATUS.OK).json({
            message: "Ticket retrieved successfully",
            data: event,
        });
    } catch (error) {
        next(error);
    }
};

export const getEventPopularityScore = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { title } = req.params;
        const event: Ticket = await ticketServices.getEventPopularityScore(Number(title));
        res.status(HTTP_STATUS.OK).json({
            message: "Ticket retrieved successfully",
            data: event,
        });
    } catch (error) {
        next(error);
    }
};