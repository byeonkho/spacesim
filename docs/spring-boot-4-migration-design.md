# Spring Boot 4 migration design

Date: 2026-07-28

## Summary

Migrate the backend from Spring Boot 3.5.16 to Spring Boot 4 in two
production-observed stages:

1. Spring Boot 4.0.7 with a complete Jackson 3 production migration and
   springdoc 3.0.3 as test-only contract tooling.
2. Spring Boot 4.1.0 only after the first stage has run in production for at
   least 24 hours without an unexplained error.

The first stage is one atomic, contract-preserving change. The production
runtime uses Jackson 3 databind plus Jackson's retained annotations artifact.
Swagger Core and Jackson 2 databind exist only in the test dependency graph,
and the deployed application does not serve `/v3/api-docs`. The migration does
not use Spring Boot's deprecated Jackson 2 compatibility module or classic
starters. It does not change the public HTTP API, generated frontend types,
JSON formats, binary chunk format, or simulation behavior.

## Why upgrade

The upgrade is a maintenance and platform investment rather than a user-facing
feature.

### Advantages

- Moves the backend to the current Spring generation, including Spring
  Framework 7, Jakarta EE 11, and Tomcat 11.
- Adopts Jackson 3 directly instead of accumulating a deprecated Jackson 2
  bridge that would require another migration.
- Aligns the test-only springdoc contract generator with its supported Spring
  Boot 4 line.
- Uses Spring Boot 4's focused production and test starters, making framework
  dependencies more explicit.
- Reduces the size and urgency of a future forced migration.
- Improves compatibility with newer Java and Spring ecosystem releases.
- Keeps the portfolio's production stack current without changing its product
  behavior.

### Disadvantages

- Provides no immediate user capability or simulation-quality improvement.
- Changes a load-bearing JSON boundary that includes custom serializers,
  persistent cache records, API responses, and OpenAPI generation.
- Moves the servlet runtime to Tomcat 11 and Servlet 6.1, which can affect
  filters, error handling, compression, and CORS behavior.
- Reorganizes Spring's test infrastructure across a backend with many
  application-context tests.
- Can leave Sentry compiling while its runtime auto-configuration silently
  stops capturing errors.
- Can change image size, cold-start time, or memory use on the sleeping Railway
  service.
- Requires two separately verified framework deployments before reaching
  Spring Boot 4.1.

The migration is worthwhile for a clean long-term baseline, but it is not
urgent based on current product behavior. A failed compatibility gate is a
reason to stop and reassess rather than accept external behavior drift.

## Version strategy

Spring's migration guidance recommends moving from the latest Spring Boot 3.5
release to the latest 4.0 maintenance release before continuing to later 4.x
releases. The first stage therefore targets Spring Boot 4.0.7 rather than
jumping directly to 4.1.0.

References:

- [Spring Boot 4 migration guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide)
- [Spring Boot 4.0 JSON support](https://docs.spring.io/spring-boot/4.0/reference/features/json.html)
- [springdoc compatibility matrix](https://springdoc.org/faq.html)

## Scope

### Included

- Spring Boot parent 3.5.16 to 4.0.7.
- springdoc 2.8.17 to 3.0.3 for test-only contract generation.
- Replacement of the deprecated web starter with the explicit Spring MVC
  starter.
- Adoption of Spring Boot 4's modular MVC test starter.
- Migration of application and test code from Jackson 2 to Jackson 3.
- Migration of custom `AbsoluteDate` and `Vector3D` JSON handling.
- Necessary compatibility changes for Sentry, Actuator, filters, CORS,
  compression, and test infrastructure.
- OpenAPI regeneration and generated frontend API verification.
- Production-container and deployed-runtime verification.

### Excluded

- Spring Boot 4.1.0.
- Public API or DTO redesign.
- Binary wire-format changes.
- Simulation or integrator refactoring.
- Unrelated dependency updates.
- Deprecated Jackson 2 compatibility modules.
- Classic Spring Boot starters.
- Performance tuning unless the migration causes a measured regression.

The Java source and bytecode target remains Java 21. The production container
continues to run on Eclipse Temurin 25.

## Component design

### Framework baseline

Use Spring Boot 4.0.7, Spring Framework 7, the explicit Spring MVC starter, and
Actuator in production. Use the focused MVC test starter and springdoc 3.0.3
for contract generation rather than restoring the broad Spring Boot 3
classpath through a classic starter.

The existing controller, service, DTO, simulation, compression, and filter
boundaries remain in place. Dependency changes must not leak into the
simulation engine or binary serializer.

### HTTP JSON mapper

Spring Boot owns one auto-configured Jackson 3 `JsonMapper`. Application code
must not replace it with a manually constructed mapper.

Custom Orekit serializers and the deserializer are registered through a
Jackson 3 module or an equivalent Spring Boot Jackson 3 extension point. A
narrow builder customizer retains explicitly required generator behavior and
disables `FAIL_ON_NULL_FOR_PRIMITIVES`. This preserves the previously accepted
behavior in which a missing primitive request property keeps its Java default
value. No broader Jackson 2 default emulation is enabled.

The request and response path remains:

`HTTP JSON -> JsonMapper -> DTO/controller -> service -> JsonMapper -> HTTP JSON`

### Horizons cache mapper

`HorizonsStateCache` keeps a private, minimal Jackson 3 mapper for its internal
`DiskEntry` schema. The cache format is intentionally independent from web
serialization policy and Spring application startup.

Existing classpath seeds and disk cache files must remain readable. Newly
written files must also be readable by the Spring Boot 3.5 version so a rollback
can reuse the same cache directory safely. A corrupt entry remains a logged
warning that is skipped; it never prevents application startup.

### Test-only OpenAPI tooling and artifact mappers

- springdoc 3.0.3, Swagger Core, and Jackson 2 databind are test dependencies
  used only for contract generation. They are absent from the production
  runtime dependency graph.
- `OpenApiContractTest` generates the OpenAPI document in a test application
  context, then uses a dedicated deterministic Jackson 3 mapper for parsing,
  sorting, normalization, and output.
- The committed `backend/openapi.json` remains the frontend code-generation
  contract. `OpenApiContractTest` generates it in write mode and fails on drift
  in its default assertion mode.
- Preset generation uses the Spring-managed `JsonMapper` because its manifest
  must match live API serialization.
- Tests that only parse response JSON may use a local minimal Jackson 3 mapper
  when application-specific configuration is irrelevant.

### Runtime integrations

Retain the existing Sentry version unless compilation or a focused
auto-configuration test demonstrates that a supported version adjustment is
required. Do not remove or disable Sentry to make the migration pass.

Keep the current origin lock, CORS, rate limits, Actuator exposure, virtual
threads, error sanitization, response compression, non-root container user, and
Railway port binding.

## Contract invariants

- `/initialize` retains its property names, nesting, value types, date strings,
  and numeric values.
- `AbsoluteDate` retains its current string representation.
- `Vector3D` remains an object with `x`, `y`, and `z` numeric properties.
- Horizons cache files remain compatible in both upgrade and rollback
  directions.
- The committed `backend/openapi.json` remains semantically identical after
  volatile metadata and object ordering are normalized.
- The production application does not expose `/v3/api-docs`; OpenAPI
  generation remains a test-only build concern.
- Generated TypeScript API types have no semantic diff.
- Known invalid requests retain their current status codes and sanitized
  response behavior.
- `/ground-truth` retains its JSON, content type, and gzip behavior.
- `/chunk` retains its byte-compatible binary format, content type, and
  exclusion from gzip compression.
- Simulation physics and performance-sensitive inner loops are unchanged.

JSON object ordering is not treated as a public contract. Property names,
values, types, inclusion behavior, and custom scalar representations are.

## Failure handling

Any semantic JSON, OpenAPI, generated-client, or binary-wire drift blocks the
migration. The frontend is not changed merely to accept accidental framework
drift.

Non-semantic OpenAPI ordering differences may be normalized. A Sentry
integration failure, missing MVC integration, unreadable existing cache entry,
changed error response, or unexplained operational regression blocks the pull
request rather than triggering a compatibility fallback.

If a test fails after the dependency switch, diagnose the failing component
boundary before changing behavior. Do not bundle unrelated cleanup into the
migration.

## Verification design

### Baseline

Before changing dependencies, record Spring Boot 3.5.16 behavior:

- Clean Maven verification on Java 21 and Java 25.
- Canonical OpenAPI output and generated TypeScript types.
- Representative initialize, ground-truth, and invalid-request responses.
- Production image size.
- Container readiness time under a 1 GiB limit.
- Memory after initialization and one chunk.
- Representative chunk status, size, content type, and compression headers.

### Spring Boot 4 gates

The migration must pass:

- Clean compile and full test suite on Java 21.
- Clean full test suite on Java 25.
- Jackson 3 serializer and deserializer tests.
- Backward and forward Horizons cache compatibility tests.
- OpenAPI generation with zero semantic contract drift.
- Frontend API regeneration with zero semantic type drift.
- Production Docker build on Temurin 25.
- Non-root container-user verification.
- Actuator health and dynamic port binding.
- Valid initialize and consecutive chunk requests.
- Ground-truth JSON and gzip checks.
- Invalid-request status and sanitized-body checks.
- CORS, origin-lock, and rate-limit integration checks.
- Sentry auto-configuration with a local fake transport or endpoint.
- Binary serializer compatibility tests.

Performance comparisons are diagnostic gates:

- Investigate an image-size increase above roughly 10 percent.
- Investigate a repeated readiness regression above one second.
- Investigate post-chunk memory growth above roughly 15 percent or 50 MiB.
- Block when a regression is unexplained or operationally meaningful.

The verified Spring Boot 4.0.7 candidate remained below every investigation
threshold:

- Production image size decreased by 2.235 percent.
- Readiness measured 1.67, 1.66, and 1.66 seconds.
- Like-for-like memory after one chunk measured 265.3 MiB and 267.2 MiB against
  the 257.3 MiB baseline, increases of roughly 3.1 and 3.9 percent.

## Rollout

After review, verification, and explicit merge authorization, merge is followed
by a separate production deployment gate:

1. Confirm the exact Railway deployment reaches `SUCCESS`.
2. Confirm startup logs show Spring Boot 4.0.7 and Java 25 with no
   auto-configuration errors.
3. Confirm Actuator health.
4. Exercise a custom simulation through initialization and consecutive chunks.
5. Confirm static preset playback remains backend-free.
6. Confirm no new Sentry initialization or application errors.
7. Observe at least one Railway sleep and wake cycle.
8. Hold Spring Boot 4.1 work for 24 hours without an unexplained production
   error.

The 24-hour observation window begins only after the exact post-merge
deployment and operational checks succeed. Local verification and merge do not
start that clock.

Any contract, runtime, or operational regression discovered during the
observation window triggers rollback. A corrected migration must pass the
deployment checks again and begin a new 24-hour observation window.

## Rollback

The migration has no database or irreversible data transformation. Rollback is
a Git revert followed by redeployment of the Spring Boot 3.5 image.

The cache compatibility gate ensures the prior application version can read any
Horizons files written by the new version. If bidirectional cache compatibility
cannot be demonstrated, the migration stops before merge.

## Completion criteria

The first stage is complete only when:

- All correctness and compatibility gates pass.
- The production deployment succeeds.
- Public API and binary contracts are unchanged.
- Operational metrics show no unexplained regression.
- The production observation window completes.
- Public architecture and dependency documentation reflects the deployed
  baseline.

Only then may the Spring Boot 4.1.0 follow-up begin as a separate dependency
update.
