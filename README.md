# Avalanche loader

## Quickstart

Edit `main.ts`, run `npm run compile`. With no errors: `kubectl apply -f dist/cdk.k8s.yaml`

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

Now you can build your own images and get minikube to use them
