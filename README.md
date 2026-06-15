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

### 4. Deploy the NestJS API to Kubernetes
```bash
make setup-all
```