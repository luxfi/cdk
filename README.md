# Avalanche loader

## Quickstart

## Develop locally

Start minikube locally:

```bash
$ minikube start
```

You can also get a dashboard by running the dashboard command:

```bash
$ minikube dashboard
```

Edit `main.ts`, run `npm run compile`. With no errors: `kubectl apply -f dist/cdk.k8s.yaml`

## Create a tls certificate

Sounds complex, but there's a script for it!

```bash
./scripts/gen-certs.ts
```

## After you edit the services typescript files and want to apply the new changes, run the following command:

```bash
npm run compile && npm run synth && kubectl apply -f dist/cdk.k8s.yaml
```

## Create your own blockchain

Capture the IP:

```bash
minikube service ava-network-lb
export IP=...
```

```bash
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "timestampvm.encode",
    "params":{
        "data":"helloworld"
    },
    "id": 1
}' -H 'content-type:application/json;' $IP/ext/vm/tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH
```

Uncomment this for local testing purposes. In order to test local docker images, run the following command first:

```bash
eval $(minikube docker-env)
```

Now you can build your own images and get minikube to use them:

```bash
docker build -t auser/ava-node ./docker/avalanchego
```

To deploy this on your local minikube, ensure you're configured based on the [minikube documentation](https://minikube.sigs.k8s.io/docs/start/).

Now you can run the compile command:

```bash
npm run compile && npm run synth && kubectl apply -f dist/cdk.k8s.yaml
```

You _only_ need to run this deployment the first time and anytime you change the configuration on avalanchego configuration.

We have a tool in `./scripts/create-config.ts` that has two simple commands to update the configuration and the genesis block. Feel free to change your own configuration and get it up locally. Remember you need to rebuild the docker image and redeploy it to the kubernetes cluster.

In one-line:

```bash
docker build -t auser/ava-node ./docker/avalanchego && npm run compile && npm run synth && kubectl apply -f dist/cdk.k8s.yaml
```

> Alternatively, you can use the `npm run deploy` command.

## Structure of the code

We're using kubernetes to run all of the nodes in the cluster behind the security of kubernetes. In order to execute APIs securely (at least, somewhat) we execute commands on the kubernetes pod using the `@kubernetes/client-node`. In order to go fast, we don't have any tests (this is medium priority) and make the `lib/ava/remoteExec.ts` file sane.

I want to minimize the amount of dependencies we install on the remote machine, but if you feel like you need to install one or a few, but try to limit the number of dependencies.

When you're working on the `src/monitor` tool, you'll need to compile it as it goes. Open two tabs and run `npm run dev` or `yarn dev` when in the `src/monitor` directory which watches the typescript files. With these compiled, you can execute the cli using the javascript:

```bash
./build/cli.js --help
```

All the commands are available in the `src/cmd/*.tsx`. Run through the [avalanche documentation](https://www.avax.network/build) and see what commands are missing to get through the tutorials and add them.

## Tips

To start minikube for local development:

```bash
minikube start --mount --memory=8192 --cpus=4 --bootstrapper=kubeadm
```

Spin up the local avalanche node inside of kubernetes using the following command:

```bash
./scripts/kube.ts port-forward -n ava -l app=avanode
```

You can connect a local proxy using the `./scripts/kube.ts` script:

```bash
# Forward the prometheus server:
./scripts/kube.ts port-forward -n monitoring -l app=prometheus-server
# Forward grafana
./scripts/kube.ts port-forward -n monitoring -l app=grafana
```

## TODO

- [ ] Write tests
- [ ] Write tests
- [ ] Fill in commands
- [ ] Make the `lib/ava/remoteExec.ts` sane and extensible. Do **NOT** execute commands locally. Use the `@kubernetes/client-node` library `exec()` command because we want to execute the commands on the kubernetes node.
- [ ] Write and expose a _small_ rpc server to expose the NodePort and the blockchain rpc host/port
- [ ] Implement NetworkPolicy for the deployments/Nodes

Feel free to execute any commands you'd like and that you discover, there are quite a few. We need to be able to execute these commands
