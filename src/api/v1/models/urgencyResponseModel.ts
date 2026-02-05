export interface urgencyResponse {
    id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
    createdAt: Date;
    ticketAge: number;
    urgencyScore: number;
    urgencyLevel: string;
}