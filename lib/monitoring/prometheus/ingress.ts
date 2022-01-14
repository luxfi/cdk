// new k.KubeIngress(this, `prometheus-ui`, {
//   metadata: {
//     namespace: "monitoring",
//     name: "prometheus-ui",
//     annotations: {
//       "kubernetes.io/ingress.class": "nginx",
//     },
//   },
//   spec: {
//     rules: [
//       {
//         host: `prometheus.lux`,
//         http: {
//           paths: [
//             {
//               path: "/",
//               pathType: "Prefix",
//               backend: {
//                 service: {
//                   name: `prometheus-service`,
//                   port: { number: 8080 },
//                 },
//               },
//             },
//           ],
//         },
//       },
//     ],
//     tls: [
//       {
//         hosts: [`prometheus.lux`],
//         secretName: `prometheus-secret`,
//       },
//     ],
//   },
// });
