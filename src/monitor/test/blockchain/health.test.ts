import {health} from "../../src/lib/ava";

jest.mock('../../src/lib/ava', () => {
    const originalModule = jest.requireActual('../../src/lib/ava');

    return {
        __esModule: true,
        ...originalModule,
        health: {health: jest.fn(() => { return {exitStatus: {status: 'Success'}, data: {checks: {}}}})},
    };
});

test('address create cli command', async () => {
    const args = {
        _: ['blockchain', 'list'],
        namespace: 'default',
        networkId: 4200,
        host: 'localhost',
        port: 9650,
        protocol: 'http',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDIxMDI2NjYsImp0aSI6ImtlSzM3aW5SaW5VRldFTG03V3gxeHhRLTQwdz0iLCJlbmRwb2ludHMiOlsiKiJdfQ.dYwxkpGkypG7BPQfCQcMgg-3cGWu3OXzdd8qV8VUu0E',
        t: 'blockchains',
        '$0': 'build\\cli.js'
    }

    const resp = await health.health(args);
    const exitStatus = resp.exitStatus;
    expect(exitStatus.status).toEqual("Success");
    expect(resp.data.checks).toEqual(expect.any(Object));
})