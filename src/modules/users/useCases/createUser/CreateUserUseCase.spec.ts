import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

describe("Create User", () => {
  let createUserUseCase: CreateUserUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = { name: "Gaules", email: "gaules@gmail.com", password: "123" };

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

    expect(userCreated).toHaveProperty("id");
  });

  it("should not be able to create a new user if the user already exists", async () => {
    expect(async () => {
      const user = {
        name: "Gaules",
        email: "gaules@gmail.com",
        password: "123",
      };
      const user2 = {
        name: "Eduardy",
        email: "gaules@gmail.com",
        password: "123",
      };

      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user2);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
