CLUSTER_NAME=gitops-local

.PHONY: create-cluster delete-cluster install-argocd setup-all build-image load-image

create-cluster:
	@echo "🚀 Creating Kubernetes cluster with 'kind'..."
	kind create cluster --name $(CLUSTER_NAME) --config cluster-config.yaml

install-argocd:
	@echo "📦 Installing ArgoCD..."
	kubectl create namespace argocd || true
	# 🔄 Using server-side apply or fallback to create to bypass the annotation size limit
	kubectl apply --server-side -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml || \
	kubectl create -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml || true
	@echo "⌛ Waiting for ArgoCD to be ready..."
	kubectl wait --namespace argocd --for=condition=ready pod --selector=app.kubernetes.io/name=argocd-server --timeout=120s

build-image:
	@echo "🐳 Building NestJS Docker image..."
	docker build -t nestjs-api:local ./apps/my-app/nestjs-api

load-image:
	@echo "🚚 Loading Docker image into Kind..."
	kind load docker-image nestjs-api:local --name $(CLUSTER_NAME)

setup-all: create-cluster install-argocd build-image load-image
	@echo "✅ Infrastructure and images are ready!"
	@echo "👉 Run 'kubectl apply -f apps/my-app/deployment.yaml' to deploy manually."
	@echo "🔗 Access your app at: http://localhost:8080"

delete-cluster:
	@echo "🗑️ Destroying cluster..."
	kind delete cluster --name $(CLUSTER_NAME)