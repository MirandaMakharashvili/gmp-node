let users = [
    {
        name: 'test',
        email: 'test@test.test',
        userId: '4ded33f3-4af9-4a08-a512-828f59b0d71d',
        hobbies: ['sport', 'dancing'],
    },
    {
        name: 'test 1',
        email: 'test@test.test',
        userId: '04c8d705-4f6c-497f-9c0e-5d9b595f783a',
        hobbies: ['sport', 'dancing', 'reading'],
    },
    {
        name: 'test 2',
        email: 'test@test.test',
        userId: '7b238d73-0d0f-49b9-a1e9-bc22087f6b62',
        hobbies: [],
    },
    {
        name: 'test 3',
        email: 'test@test.test',
        userId: '09b8f419-498f-4fdb-9048-c49bf4cf73bf',
        hobbies: [],
    },
    {
        name: 'test 4',
        email: 'test@test.test',
        userId: 'fa0ba1df-7509-482a-84bd-c79b80eafcfb',
        hobbies: ['sport', 'dancing'],
    },
    {
        name: 'test 5',
        email: 'test@test.test',
        userId: '42fad595-89ea-492d-b6dd-9ebcbe09be92',
        hobbies: ['sport', 'dancing', 'drawing'],
    },
    {
        name: 'test 6',
        email: 'test@test.test',
        userId: '1180ea5f-2182-4fbf-9536-d77670c36ec5',
        hobbies: [],
    },
    {
        name: 'test 7',
        email: 'test@test.test',
        userId: '8ce97f3b-3f1c-41e2-8609-eb1d5119fbec',
        hobbies: [],
    },
];

function addUser(user) {
    users.push(user);
}

function getUserHobbies(userId) {
    const user = users.find((user) => user.userId === userId);
    if (user && user.hobbies.length > 0) {
        return user.hobbies;
    }

    return `User with ID: ${userId} does not have any hobby.`;
}

module.exports = {
    users,
    addUser,
    getUserHobbies,
};
