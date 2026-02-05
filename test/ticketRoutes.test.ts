import request from "supertest";
import app from "../src/app";
import * as ticketController from "../src/api/v1/controllers/ticketController";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/controllers/ticketController", () => ({
    getAllTickets: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    createTicket: jest.fn((req, res) => res.status(HTTP_STATUS.CREATED).send()),
    updateTicket: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    deleteTicket: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    getTicketById: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    getTicketUrgencyScore: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
}));

describe("Ticket Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/tickets/", () => {
        it("should call getAllTickets controller", async () => {
            await request(app).get("/api/v1/tickets/");
            expect(ticketController.getAllTickets).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/tickets/", () => {
        it("should call createTicket controller with valid data", async () => {
            const mockItem = {
                title: "Test",
                description: "Test",
                priority: "high",
                status: "open",
                createdAt: new Date,
            };

            await request(app).post("/api/v1/tickets/").send(mockItem);
            expect(ticketController.createTicket).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/tickets/:id", () => {
        it("should call updateTicket controller with valid data", async () => {
            const mockItem = {
                title: "Test",
                description: "Test",
                priority: "medium",
                status: "resolved",
                createdAt: new Date,
            };

            await request(app).put("/api/v1/tickets/testId").send(mockItem);
            expect(ticketController.updateTicket).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/tickets/:id", () => {
        it("should call deleteTicket controller with valid data", async () => {
            await request(app).delete("/api/v1/tickets/testId");
            expect(ticketController.deleteTicket).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/tickets/:id", () => {
        it("should call getTicketById controller with valid data", async () => {
            await request(app).get("/api/v1/tickets/testId");
            expect(ticketController.getTicketById).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/tickets/:id/urgency", () => {
        it("should call getTicketUrgencyScore controller with valid data", async () => {
            await request(app).get("/api/v1/tickets/testId/urgency");
            expect(ticketController.getTicketUrgencyScore).toHaveBeenCalled();
        });
    });

})