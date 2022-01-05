"use strict";

import * as fs from "fs";
import * as path from "path";
import * as k8s from "@kubernetes/client-node";
import { RequestResult } from "@kubernetes/client-node/dist/watch";

const userDir =
  process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"];

export const stopWatch = (watch: Promise<RequestResult>) => () =>
  new Promise((resolve, reject) =>
    watch.then((res: any) => resolve(res.abort())).catch((err) => reject(err))
  );

export type watchObj = {
  phase: string;
  obj: any;
  watch: k8s.Watch;
  stop: () => void;
};
export type watchReq = { path?: string; qs?: any };
export type watchFn = (err: Error | null, resp: watchObj | null) => void;

export class Requester {
  private client: k8s.KubeConfig;
  // private apiClient: k8s.ApiClient;
  // private registrations:

  constructor() {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    this.client = kc;
  }

  async getPods(namespace = "default") {
    const apiClient = this.client.makeApiClient(k8s.CoreV1Api);
    const res = await apiClient.listNamespacedPod(namespace);
    return res.body;
  }

  async watch(req: watchReq = { path: "/api/v1/namespaces" }, cb: watchFn) {
    const watch = new k8s.Watch(this.client);
    const path = req.path || "/api/v1/namespaces";
    const qs = req.qs || {};
    return new Promise(
      (
        resolve: (watcher: any) => void,
        reject: (resp: {
          err: Error;
          watch: k8s.Watch;
          stop: () => void;
        }) => void
      ) => {
        const req = watch.watch(
          path,
          qs,
          (phase: string, obj: any) => {
            cb(null, { phase, obj, watch, stop: stopWatch(req) });
          },
          (err: Error) => {
            reject({ err, watch, stop: stopWatch(req) });
          }
        );
        resolve(req);
      }
    );
  }
}
