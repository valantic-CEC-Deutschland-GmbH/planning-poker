export default interface DatabaseRoom {
    id?: string;
    name: string;
    ownerId: number;
}

/**
 * if is Success = false message can be a error else its the uuid of the created room
 */
export interface NewRoomResponseInterface {
    errors: Array<string>;
    message: undefined|string;
    isSuccess: boolean;
}