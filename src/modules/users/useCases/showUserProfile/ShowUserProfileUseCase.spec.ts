import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe("Show User", () => {
  let inMemoryUsersRepository: IUsersRepository;
  let showUserProfileUseCase: ShowUserProfileUseCase;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to get user info by id", async () => {
    const user = {
      name: "Eduardy",
      email: "eduardylopes@gmail.com",
      password: "123",
    };

    const createdUser = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const getUser = await showUserProfileUseCase.execute(
      createdUser.id as string
    );

    expect(getUser).toHaveProperty("id");
    expect(createdUser.id).toEqual(getUser.id);
  });

  it("should not be able list a non existent user", () => {
    expect(async () => {
      const fakeId = "666";
      await showUserProfileUseCase.execute(fakeId);
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
