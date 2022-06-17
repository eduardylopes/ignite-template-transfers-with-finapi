import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create Statement", () => {
  let createStatementUseCase: CreateStatementUseCase;
  let createUserUseCase: CreateUserUseCase;
  let inMemoryStatementsRepository: IStatementsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able get user balance", async () => {
    const user = {
      name: "Eduardy",
      email: "eduardylopes@gmail.com",
      password: "123",
    };

    const createdUser = await createUserUseCase.execute(user);

    const statement = {
      user_id: createdUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 200,
      description: "rent payment",
    };

    const createdStatement = await createStatementUseCase.execute(statement);
    console.log(createdStatement);

    expect(createdStatement.amount).toEqual(statement.amount);
  });

  it("should not be able get balance from a non existent user", () => {
    expect(async () => {
      const user = {
        name: "Eduardy",
        email: "eduardylopes@gmail.com",
        password: "123",
      };

      const createdUser = await createUserUseCase.execute(user);

      const statement = {
        user_id: createdUser.id as string,
        type: OperationType.DEPOSIT,
        amount: 200,
        description: "rent payment",
      };

      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
