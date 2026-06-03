# Threat Model

## Priority Threats

- Unauthorized access to resumes or reports
- Token theft or session abuse
- Prompt or payload injection into ML-adjacent workflows
- Excessive data retention of candidate artifacts
- Service-to-service contract drift leading to unsafe fallbacks

## Mitigation Themes

- Strong auth and session expiry
- Input validation and output encoding
- Bounded internal network paths
- Audit logging for sensitive reads and shares
- Explicit retention and deletion policies
