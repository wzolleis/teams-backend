class ServerIO {
    public sendResponse(res: any, data: object = {}) {
        res.json(data);
    }
    public sendError(res: any, status: number, message: string) {
        res.status(status).send(message);
    }
}

export const serverIo: ServerIO = new ServerIO();
