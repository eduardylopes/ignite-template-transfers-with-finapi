import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "../getBalance/GetBalanceError";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create Statement", () => {
  let createStatementUseCase: CreateStatementUseCase;
  let createUserUseCase: CreateUserUseCase;
  let getStatementOperationUseCase: GetStatementOperationUseCase;
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
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able get user statement operation", async () => {
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

    const userStatement = await getStatementOperationUseCase.execute({
      user_id: createdUser.id as string,
      statement_id: createdStatement.id as string,
    });

    expect(userStatement).toHaveProperty("id");
  });

  it("should not be able get statement for a non existent user", () => {
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

      const createdStatement = await createStatementUseCase.execute(statement);

      await getStatementOperationUseCase.execute({
        user_id: "invalid_id9090324901092390",
        statement_id: createdStatement.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
});
