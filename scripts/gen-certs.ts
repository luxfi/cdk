#!/usr/bin/env ts-node

const path = require("path");
const fs = require("fs");
const selfsigned = require("selfsigned");

const args = require("yargs")
  .env("AVA")
  .options({
    commonName: {
      alias: "n",
      default: `prometheus-service.monitoring.svc.cluster.local`,
    },
    countryName: {
      alias: "c",
      default: "IM",
    },
    localityName: {
      alias: "l",
      default: "CITY",
    },
    stateOrProvinceName: {
      alias: "s",
      default: "CITY",
    },
    organizationName: {
      alias: "o",
      default: "lux",
    },
    organizationalUnitName: {
      default: "C",
    },
    emailAddress: {
      default: "us@lux",
      help: "email address",
    },
    outDir: {
      default: path.join(
        __dirname,
        "..",
        "lib",
        "monitoring",
        "configs",
        "prometheus",
        "cert"
      ),
      help: "directory to save the certs",
    },
  })
  .help(`Generate self-signed certificates`)
  .alias("help", "h").argv;

console.log(`Generating certs`);
const attrs = [
  {
    name: "commonName",
    value: args.commonName,
  },
  { name: "countryName", value: args.countryName },
  { name: "localityName", value: args.localityName },
  { name: "stateOrProvinceName", value: args.stateOrProvinceName },
  { name: "organizationName", value: args.organizationName },
  { name: "organizationalUnitName", value: args.organizationalUnitName },
  { name: "emailAddress", value: args.emailAddress },
];

const outDir = path.normalize(args.outDir);
const pems = selfsigned.generate(attrs, {
  algorithm: "rsa",
  keySize: 4096,
  days: 365,
});

console.log(`Generated pems, saving to ${outDir}`);

const keyFile = path.join(outDir, "tls.key");
const certFile = path.join(outDir, `tls.crt`);
const privKey = path.join(outDir, "tls.priv");
fs.writeFileSync(certFile, pems.cert, "utf-8");
fs.writeFileSync(keyFile, pems.public, "utf-8");
fs.writeFileSync(privKey, pems.private, "utf-8");

console.log(`Done. Check your path`);
