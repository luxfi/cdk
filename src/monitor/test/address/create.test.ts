import {avm} from "../../src/lib/ava";

jest.mock('../../src/lib/ava', () => {
    const originalModule = jest.requireActual('../../src/lib/ava');

    return {
        __esModule: true,
        ...originalModule,
        avm: {createAddress: jest.fn(() => { return {exitStatus: {status: 'Success'}}})},
    };
});

test('address create cli command', async () => {
    const args = {
        "_": [ 'address', 'create' ],
        username: 'user',
        password: 'password',
        namespace: 'default',
        networkId: 4200,
        host: 'localhost',
        port: 9650,
        protocol: 'http',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDIxMDI2NjYsImp0aSI6ImtlSzM3aW5SaW5VRldFTG03V3gxeHhRLTQwdz0iLCJlbmRwb2ludHMiOlsiKiJdfQ.dYwxkpGkypG7BPQfCQcMgg-3cGWu3OXzdd8qV8VUu0E',
        chain: 'X',
        '$0': 'build\\cli.js'
    }

    const chain = args.chain;
    const opts = Object.assign({}, args, {
        path: (originalPath: string) => `${originalPath}/${chain}`,
    });

    const resp = await avm.createAddress(opts);
    expect(resp.exitStatus.status).toEqual("Success");
})
