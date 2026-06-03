import http from "k6/http";
import { check, sleep } from "k6";

export default function () {
  const response = http.get(__ENV.TARGET_URL ?? "http://localhost:3000");
  check(response, {
    "status is 200": (r) => r.status === 200,
  });
  sleep(1);
}
