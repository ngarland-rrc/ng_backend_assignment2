import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as ticketServices from "../services/ticketServices";
import type { Ticket } from "../models/ticketModel";
import { urgencyResponse } from "../models/urgencyResponseModel";

const allowedPriorities: string[] = ["critical", "high", "medium", "low"];
const allowedStatus: string[] = ["open", "in-progress", "resolved"];

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

        } else if (!allowedStatus.includes(req.body.status)) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: `Invalid priority. Must be one of: ${allowedStatus.join(", ")}`,
            });

        } else {
            const { title, description, priority, status } = req.body;
            const ticketData: {
                title: string;
                description: string;
                priority: string;
                status: string;
            } = { title, description, priority, status };

            const newTicket: Ticket = await ticketServices.createTicket(ticketData);
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

            const id: number = Number(req.params.id);

            const { priority, status } = req.body;

            const updateData = { priority, status };

            const updatedTicket: Ticket = await ticketServices.updateTicket((id), updateData);
            res.status(HTTP_STATUS.OK).json({
                message: "Ticket updated successfully",
                data: updatedTicket,
            });
        }
    } catch (error: any) {
        if (error.message.includes("not found")) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: error.message,
            });
        }
        next(error);
    }
};

export const deleteTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id)
        await ticketServices.deleteTicket(id);
        res.status(HTTP_STATUS.OK).json({
            message: "Ticket deleted successfully",
        });
    } catch (error: any) {
        if (error.message.includes("not found")) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: error.message,
            });
        }
        next(error);
    }
};

export const getTicketById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: number = Number(req.params.id);

        const ticket: Ticket = await ticketServices.getTicketById(id);

        res.status(HTTP_STATUS.OK).json({
            message: "Ticket retrieved successfully",
            data: ticket,
        });
    } catch (error: any) {
        if (error.message.includes("not found")) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: error.message,
            });
        }
        next(error);
    }
};



export const getTicketUrgencyScore = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: number = Number(req.params.id);
        const ticket: urgencyResponse = await ticketServices.getTicketUrgencyScore(id);

        res.status(HTTP_STATUS.OK).json({
            message: "Ticket urgency calculated",
            data: ticket,
        });
    } catch (error: any) {
        if (error.message.includes("not found")) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: error.message,
            });
        }
        next(error);
    }
};