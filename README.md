# 🚀 Cloud Native GitOps Lab (NestJS + Kubernetes + ArgoCD)

A complete, production-ready **Cloud Native local development ecosystem** that demonstrates modern DevOps architectures. This project bundles a high-performance **NestJS REST API** containerized with a multi-stage Docker build, orchestrated inside a local **Kubernetes cluster (Kind)**, and continuously deployed using a **GitOps pipeline (ArgoCD)**.

---

## 🧰 CNCF Landscape Technologies Used

* **Orchestration & Management:** [Kubernetes](https://landscape.cncf.io/?item=orchestration-management--scheduling--kubernetes) (via [Kind](https://kind.sigs.k8s.io/) for resource-efficient local nodes).
* **Application Definition & Development:** [ArgoCD](https://landscape.cncf.io/?item=app-definition-development--continuous-delivery--argo) (acting as the declarative GitOps engine).
* **App Definition & Build:** [Docker](https://landscape.cncf.io/?item=container-runtime--containerd) (Multi-stage builds for minimal image sizes).

---

## 🏗️ Architecture & Workflow

This project establishes an automated delivery workflow directly on your local machine:

1.  **Development:** Code changes are implemented using NestJS modular components inside `apps/my-app/api/`.
2.  **Infrastructure Initialization:** A `Makefile` automates cluster deployment, network port-mapping (`localhost:8080` -> `containerPort: 30080`), and ArgoCD setups.
3.  **GitOps Synchronization:** ArgoCD monitors the remote GitHub repository tracking changes inside the `apps/my-app/` manifests.
4.  **Self-Healing & Scalability:** Kubernetes actively ensures high availability across multiple application replicas.

---

## 🛠️ Prerequisites

Ensure you have the following tools installed:

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine
* [Kind CLI](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
* [Kubectl CLI](https://kubernetes.io/docs/tasks/tools/)
* [Node.js (v18+)](https://nodejs.org/) & `npm`
* GNU `make` (Pre-installed on macOS/Linux. Use Git Bash/WSL for Windows).

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sergioparamo/cloud-native-gitops.git
cd cloud-native-gitops
```

### 2. Provision the Local Infrastructure

Spin up a Kind cluster, install ArgoCD, and build/load the NestJS image — all in a single Make target:

```bash
make setup-all
```

Under the hood this runs the following targets in order (see `Makefile`):

| Target           | Purpose                                                                     |
| ---------------- | --------------------------------------------------------------------------- |
| `create-cluster` | Creates the `gitops-local` Kind cluster from `cluster-config.yaml`.         |
| `install-argocd` | Installs ArgoCD into the `argocd` namespace and waits until ready.          |
| `build-image`    | Builds `nestjs-api:local` from `apps/my-app/nestjs-api/Dockerfile`.         |
| `load-image`     | Loads the local image into the Kind node so `imagePullPolicy: Never` works. |

> The Kind config maps `containerPort: 30080` → `hostPort: 8080`, so the NodePort service will be reachable at `http://localhost:8080`.

### 3. Register the App with ArgoCD (GitOps Sync)

Apply the ArgoCD `Application` manifest so the cluster starts pulling `apps/my-app/` from this repo and reconciling it automatically:

```bash
kubectl apply -f apps/my-app/argocd-app.yaml
```

This creates the `nestjs-gitops-app` Application with `automated.prune` and `selfHeal` enabled — meaning any drift in the cluster will be corrected back to whatever is committed under `apps/my-app/`.

### 4. (Optional) Access the ArgoCD UI

```bash
# Forward the ArgoCD API server to localhost:8081
kubectl port-forward svc/argocd-server -n argocd 8081:443

# Get the initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d && echo
```

Then open <https://localhost:8081> and log in as `admin` with the password above.

### 5. Verify the Deployment

ArgoCD will deploy the `Deployment` and `Service` defined in `apps/my-app/deployment.yaml` (2 replicas, NodePort `30080`). Confirm they are healthy:

```bash
kubectl get pods -l app=nestjs-api
kubectl get svc nestjs-api-service
```

### 6. Hit the API

The service is reachable on the host via the Kind port mapping:

```bash
# Health check
curl http://localhost:8080/

# List tasks
curl http://localhost:8080/tasks

# Create a task
curl -X POST http://localhost:8080/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Try GitOps"}'

# Delete a task
curl -X DELETE http://localhost:8080/tasks/1
```

### 7. Trigger a GitOps Update

Make a change inside `apps/my-app/` (for example, bump `replicas` in `deployment.yaml`), commit, and push. ArgoCD will detect the change in Git and reconcile the cluster automatically — no `kubectl apply` required.

### 8. Tear Down

When you're done, delete the cluster (and everything in it) with:

```bash
make delete-cluster
```