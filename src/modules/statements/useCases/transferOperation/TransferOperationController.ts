import { Request, response, Response } from "express";

class TransferOperationController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: receiver_id } = request.params;
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;

    return response.send();
  }
}

export { TransferOperationController };
