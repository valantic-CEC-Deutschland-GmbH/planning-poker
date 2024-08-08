export interface DatabaseEstimation {
    id?: number;
    roomUserId: number;
    time: number;
}

export interface DatabaseEstimationWithUser {
    id?: number;
    time: number;
    roomUser: {
        id: number;
        roomId: string;
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
        }
    }
}