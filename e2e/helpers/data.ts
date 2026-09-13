import { faker } from '@faker-js/faker';

const PHONE_NUMBER = '123123123';
const VALID_PASSWORD = 'HoneyPotatoe123!';

export interface User {
    firstName: string;
    lastName: string;
    dob: string;
    country: string;
    postalCode: string;
    houseNumber: string;
    street: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    password: string;
}

export function buildUser(overrides: Partial<User> = {}): User {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        dob: faker.date.birthdate({ min: 18, max: 75, mode: 'age' }).toISOString().split('T')[0],
        country: faker.location.country(),
        postalCode: faker.location.zipCode(),
        houseNumber: faker.location.buildingNumber(),
        street: faker.location.street(),
        city: faker.location.city(),
        state: faker.location.state(),
        phone: PHONE_NUMBER,
        email: faker.internet.email(),
        password: VALID_PASSWORD,
        ...overrides,
    };
}