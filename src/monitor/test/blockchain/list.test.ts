import {platform} from "../../src/lib/ava";

jest.mock('../../src/lib/ava', () => {
    const originalModule = jest.requireActual('../../src/lib/ava');

    return {
        __esModule: true,
        ...originalModule,
        platform: {getBlockchains: jest.fn(() => { return {exitStatus: {status: 'Success'}, data: {blockchains: [{}]}}})},
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

    const resp = await platform.getBlockchains(args);
    const exitStatus = resp.exitStatus;
    expect(exitStatus.status).toEqual("Success");
    expect(resp.data.blockchains).toEqual(expect.arrayContaining([expect.any(Object)]));
})