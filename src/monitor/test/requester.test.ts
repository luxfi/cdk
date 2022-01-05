import { Requester, watchObj } from "../src/requester";
import chai from "chai";
import spies from "chai-spies";
import asPromised from "chai-as-promised";
import request = require("request");
import * as k8s from "@kubernetes/client-node";

chai.use(spies);
chai.use(asPromised);

const expect = chai.expect;

describe("requester", () => {
  let req: any;

  afterEach(() => {
    if (req) {
      req.abort();
    }
  });

  it("does not blow up on creation", async () => {
    expect(() => new Requester()).not.to.throw();
  });

  it("can make an api request for api pods", async () => {
    let r = new Requester();
    const resp = await r.getPods();
    expect(Array.isArray(resp));
  });

  it("can watch for changes", async () => {
    const mockFn = jest.fn();
    let r = new Requester();
    req = await r.watch({ path: "/api/v1/namespaces" }, mockFn);
    expect(req).to.have.property("headers");
  });

  it("calls the callback when watching for changes", async () => {
    let r = new Requester();
    let calledResponse = false;
    const mockFn = chai.spy((err: Error | null, res: any | null) => {});
    // let res: any;
    req = await r.watch({ path: "/api/v1/namespaces" }, mockFn);
    expect(mockFn).to.have.been.called;
  });
});
