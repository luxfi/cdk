import socket

from kubernetes import client, config


def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # doesn't even have to be reachable
        s.connect(("10.255.255.255", 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = "127.0.0.1"
    finally:
        s.close()
    return IP


def main():
    try:
        config.load_incluster_config()
    except:
        config.load_kube_config()

    v1 = client.CoreV1Api()
    ret = v1.list_namedspaced_pod("default")
    # Since we only need one, take the first one if there is one
    if len(ret.items) > 0:
        local_ip = get_ip()
        # First one
        pod_ip = next(i.status.pod_ip for i in ret.items if i.status.pod_ip != local_ip)
        print("%s:9650" % pod_ip)


if __name__ == "__main__":
    main()
