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

export function dateOfBirthForAge(age: number, dayOffset = 0): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - age);
    date.setDate(date.getDate() + dayOffset);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function buildUserData(overrides: Partial<User> = {}): User {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        dob: faker.date.birthdate({ min: 19, max: 74, mode: 'age' }).toISOString().split('T')[0],
        country: faker.location.countryCode(),
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