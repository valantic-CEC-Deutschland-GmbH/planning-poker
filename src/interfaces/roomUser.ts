import { DatabaseUser } from "lucia";

export interface DatabaseRoomUser {
    id?: number;
    roomId: string;
    userId: number;
}

export interface DatabaseRoomUserWithUser extends DatabaseRoomUser {
    user: {
        id: number;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }|null;
}