package vn.lebao.lab;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import org.junit.jupiter.api.Test;

class HealthControllerTest {
  private final HealthController controller = new HealthController();

  @Test
  void returnsHealthyServiceStatus() {
    Map<String, String> response = controller.health();
    assertThat(response).containsEntry("status", "UP");
    assertThat(response).containsEntry("service", "cicd-demo-api");
  }
}
