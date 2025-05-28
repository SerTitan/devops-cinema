# Команды по куберу

## Краткое описание
Я сюда занесу только базовые наборы команды, т.к. повторное разворачивание кластер, **надеюсь**, не пригодится.

## Команды
- `kubectl get nodes` - просмотр всех нод (у нас только одна нода, control plane);
- `kubectl get pods -n kube-system` - просмотр системных подов (тут метрики, etcd и прочее);
- `kubectl get pods -o wide` - просмотр подов с расширенным выводом;
- `kubectl apply -k .` - применение всех манифестов через kustomization.yaml (выполнять в папке с манифестами);
- `kubectl delete --all pods` - удаляет все кастомные поды (не системные);
- `kubectl describe pod {name}` - выводит описание определенного пода;
- `kubectl scale deployment {name} --replicas=0` - понижение количество реплик до 0 для определенного deployment;
- `kubectl top pods` - просмотр метрик подов (память и CPU);
- `kubectl logs {name}` - логи пода.