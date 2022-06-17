import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

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

  it("should be able to create a deposit statement", async () => {
    const user = {
      name: "Eduardy",
      email: "eduardylopes@gmail.com",
      password: "123",
    };

    const createdUser = await createUserUseCase.execute(user);

    const statement = {
      user_id: createdUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "rent payment",
    };

    const createdStatement = await createStatementUseCase.execute(statement);

    expect(createdStatement).toHaveProperty("id");
    expect(createdStatement.amount).toEqual(statement.amount);
    expect(createdStatement.type).toEqual(statement.type);
  });

  it("should be able to withdraw statement", async () => {
    const user = {
      name: "Eduardy",
      email: "eduardylopes@gmail.com",
      password: "123",
    };

    const createdUser = await createUserUseCase.execute(user);

    const statement = {
      user_id: createdUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "rent payment",
    };

    await createStatementUseCase.execute(statement);

    statement.type = OperationType.WITHDRAW;

    const createdStatement = await createStatementUseCase.execute(statement);

    expect(createdStatement).toHaveProperty("id");
    expect(createdStatement.amount).toEqual(statement.amount);
    expect(createdStatement.type).toEqual(statement.type);
  });

  it("should not be able to withdraw a value when the amount is less than withdraw amount", () => {
    expect(async () => {
      const user = {
        name: "Eduardy",
        email: "eduardylopes@gmail.com",
        password: "123",
      };

      const createdUser = await createUserUseCase.execute(user);

      const statement = {
        user_id: createdUser.id as string,
        type: OperationType.WITHDRAW,
        amount: 200,
        description: "rent payment",
      };

      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("should not be able to withdraw a value to a non existent user", () => {
    expect(async () => {
      const statement = {
        user_id: "invalid_id231451213214",
        type: OperationType.WITHDRAW,
        amount: 200,
        description: "rent payment",
      };

      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to deposit a value to a non existent user", () => {
    expect(async () => {
      const statement = {
        user_id: "invalid_id231451213214",
        type: OperationType.DEPOSIT,
        amount: 200,
        description: "rent payment",
      };

      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
