import { getTicketUrgencyScore, } from "../src/api/v1/services/ticketServices";
import { mockTickets } from "../src/data/ticketdata";

describe("getTicketUrgencyScore", () => {
    beforeEach(() => {
        // Clear the in-memory array before each test
        mockTickets.length = 0;

        jest.useFakeTimers();
        jest.setSystemTime(new Date("2026-01-10T00:00:00Z"));
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    it("calculates Critical urgencyLevel", async () => {
        const ticket = {
            id: 1,
            title: "Test",
            description: "Test",
            priority: "critical",
            status: "open",
            createdAt: new Date("2026-01-01T00:00:00Z"),
        };

        mockTickets.push(ticket);

        const result = await getTicketUrgencyScore(1);

        expect(result.urgencyLevel).toBe("Critical. Immediate attention required.");
    });

    it("calculates high urgencyLevel", async () => {
        const ticket = {
            id: 1,
            title: "Test",
            description: "Test",
            priority: "critical",
            status: "open",
            createdAt: new Date("2026-01-09T00:00:00Z"),
        };

        mockTickets.push(ticket);

        const result = await getTicketUrgencyScore(1);

        expect(result.urgencyLevel).toBe("High urgency. Prioritize resolution.");
    });

    it("calculates moderate urgencyLevel", async () => {
        const ticket = {
            id: 1,
            title: "Test",
            description: "Test",
            priority: "medium",
            status: "open",
            createdAt: new Date("2026-01-07T00:00:00Z"),
        };

        mockTickets.push(ticket);

        const result = await getTicketUrgencyScore(1);

        expect(result.urgencyLevel).toBe("Moderate. Schedule for attention.");
    });

    it("calculates low urgencyLevel", async () => {
        const ticket = {
            id: 1,
            title: "Test",
            description: "Test",
            priority: "low",
            status: "open",
            createdAt: new Date("2026-01-09T00:00:00Z"),
        };

        mockTickets.push(ticket);

        const result = await getTicketUrgencyScore(1);

        expect(result.urgencyLevel).toBe("Low urgency. Address when capacity allows.");
    });
    it("calculates resolved urgencyLevel", async () => {
        const ticket = {
            id: 1,
            title: "Test",
            description: "Test",
            priority: "low",
            status: "resolved",
            createdAt: new Date("2026-01-01T00:00:00Z"),
        };

        mockTickets.push(ticket);

        const result = await getTicketUrgencyScore(1);

        expect(result.urgencyLevel).toBe("Minimal, Ticket resolved.");
    });
})