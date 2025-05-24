package ru.spb.itmo.asashina.backend.scheduler;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class MetricScheduler {

    private final RestClient pushGatewayRestClient;
    private final RestClient actuatorRestClient;

    public MetricScheduler(
            RestClient.Builder builder,
            @Value("${pushgateway.url}") String pushGatewayUrl) {

        this.pushGatewayRestClient = builder
                .baseUrl(pushGatewayUrl)
                .build();
        this.actuatorRestClient = builder
                .baseUrl("http://localhost:8081/actuator/prometheus")
                .build();
    }

    @Scheduled(fixedRate = 10_000, timeUnit = TimeUnit.MILLISECONDS)
    public void sendMetrics() {
        try {
            var metrics = actuatorRestClient.get()
                    .retrieve()
                    .body(String.class);
            var rs = pushGatewayRestClient.post()
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE)
                    .body(new ByteArrayResource(metrics.getBytes(StandardCharsets.UTF_8)))
                    .retrieve()
                    .toBodilessEntity();
            log.debug("Отправили следующие метрики в PushGateway. Код ответа: {}. \n{}", rs.getStatusCode(), metrics);
        } catch (Exception exception) {
            log.error("Ошибка при отправке метрик в PushGateway", exception);
        }
    }
}
