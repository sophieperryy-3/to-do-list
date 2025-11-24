# Logging and Observability

## 🎯 Overview

This application implements structured logging and observability best practices to enable monitoring, debugging, and security incident response.

## 📊 Logging Architecture

```
Application Request
    ↓
Express Middleware (generates request ID)
    ↓
Winston Logger (structured JSON logs)
    ↓
AWS Lambda → CloudWatch Logs
    ↓
CloudWatch Log Groups
    ↓
[Optional] CloudWatch Insights / ELK / Splunk
```

## 🔍 Log Structure

All logs follow a consistent JSON structure:

```json
{
  "timestamp": "2025-11-24T10:30:45.123Z",
  "level": "info",
  "message": "Task created successfully",
  "requestId": "req-abc123-def456",
  "method": "POST",
  "path": "/tasks",
  "statusCode": 201,
  "duration": 45,
  "userId": "user-123",
  "metadata": {
    "taskId": "task-789"
  }
}
```

### Key Fields

- **timestamp**: ISO 8601 format for precise time tracking
- **level**: `info`, `warn`, `error` for filtering
- **message**: Human-readable description
- **requestId**: Unique correlation ID for tracing requests across services
- **method/path**: HTTP request details
- **statusCode**: Response status for monitoring
- **duration**: Request processing time in milliseconds
- **metadata**: Additional context (task IDs, user info, etc.)

## 🛠️ Implementation

### Backend Logger (`backend/src/utils/logger.ts`)

Uses Winston for structured logging:

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
});
```

### Request ID Middleware

Every request gets a unique ID for tracing:

```typescript
app.use((req, res, next) => {
  req.requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  next();
});
```

## 📈 Viewing Logs in AWS

### CloudWatch Logs

All Lambda logs automatically go to CloudWatch:

**Log Group**: `/aws/lambda/todo-api-function`

**View logs via AWS CLI**:
```bash
# Tail logs in real-time
aws logs tail /aws/lambda/todo-api-function --follow

# Filter by error level
aws logs filter-log-events \
  --log-group-name /aws/lambda/todo-api-function \
  --filter-pattern '{ $.level = "error" }'

# Search by request ID
aws logs filter-log-events \
  --log-group-name /aws/lambda/todo-api-function \
  --filter-pattern '{ $.requestId = "req-abc123-def456" }'
```

**View logs via AWS Console**:
1. Navigate to CloudWatch → Log groups
2. Select `/aws/lambda/todo-api-function`
3. Use CloudWatch Insights for advanced queries

## 🔎 CloudWatch Insights Queries

### Find all errors in the last hour
```
fields @timestamp, level, message, requestId, path
| filter level = "error"
| sort @timestamp desc
| limit 100
```

### Calculate average response time
```
fields @timestamp, duration
| filter duration > 0
| stats avg(duration) as avg_duration, max(duration) as max_duration, count() as request_count
```

### Identify slow requests (>1000ms)
```
fields @timestamp, method, path, duration, requestId
| filter duration > 1000
| sort duration desc
```

### Track requests by endpoint
```
fields path, statusCode
| stats count() by path, statusCode
```

## 🚨 Alerting & Monitoring

### Recommended CloudWatch Alarms

#### 1. High Error Rate
**Metric**: Error count > 10 in 5 minutes  
**Action**: Send SNS notification to on-call engineer

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name todo-api-high-error-rate \
  --alarm-description "Alert when error rate is high" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold
```

#### 2. High Response Time
**Metric**: Average duration > 2000ms  
**Action**: Investigate performance issues

#### 3. Lambda Throttling
**Metric**: Throttles > 0  
**Action**: Increase Lambda concurrency limits

### Security Monitoring: Failed Request Detection

**Scenario**: Detect potential brute-force or DDoS attacks

**Implementation**:
1. Log all failed requests (4xx, 5xx) with source IP
2. Use CloudWatch Insights to detect patterns:

```
fields @timestamp, sourceIp, statusCode, path
| filter statusCode >= 400
| stats count() as failed_requests by sourceIp
| filter failed_requests > 100
| sort failed_requests desc
```

3. **Automated Response** (advanced):
   - Lambda function triggered by CloudWatch alarm
   - Updates AWS WAF rules to block suspicious IPs
   - Sends alert to security team

**Example Lambda for IP blocking**:
```python
import boto3

def lambda_handler(event, context):
    waf = boto3.client('wafv2')
    suspicious_ip = event['detail']['sourceIp']
    
    # Add IP to WAF block list
    waf.update_ip_set(
        Name='BlockedIPs',
        Id='ip-set-id',
        Addresses=[f'{suspicious_ip}/32']
    )
```

## 📊 Centralized Logging (Production Enhancement)

For production environments, consider shipping logs to a centralized system:

### Option 1: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Setup**: CloudWatch → Lambda → Elasticsearch
- **Benefits**: Powerful search, visualization, alerting
- **Use case**: Large-scale applications with complex queries

### Option 2: Splunk
- **Setup**: CloudWatch → Kinesis Firehose → Splunk
- **Benefits**: Enterprise-grade analytics, compliance reporting
- **Use case**: Regulated industries requiring audit trails

### Option 3: Datadog / New Relic
- **Setup**: CloudWatch → Datadog Lambda extension
- **Benefits**: APM, distributed tracing, infrastructure monitoring
- **Use case**: Full-stack observability

## 🔐 Security & Compliance

### Log Retention
- **Development**: 7 days
- **Production**: 90 days (or per compliance requirements)
- **Audit logs**: 1-7 years

**Set retention via Terraform**:
```hcl
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/todo-api-function"
  retention_in_days = 90
}
```

### Sensitive Data Handling
- ❌ **Never log**: Passwords, API keys, credit card numbers
- ✅ **Always log**: Request IDs, timestamps, status codes, error messages
- ⚠️ **Redact if needed**: Email addresses, IP addresses (GDPR considerations)

### Compliance Evidence
Logs provide evidence for:
- **SOC 2**: Access logs, error tracking, incident response
- **GDPR**: Data access requests, deletion confirmations
- **PCI DSS**: Transaction logs, security event monitoring

## 🎯 Demo Points for Presentation

1. **Show structured logs**: Run a request and show the JSON log in CloudWatch
2. **Demonstrate request tracing**: Use request ID to trace a request end-to-end
3. **Show error logging**: Trigger an error and show it in logs with stack trace
4. **Explain alerting**: Describe how CloudWatch alarms would notify on-call engineers
5. **Security monitoring**: Explain how logs could detect and block malicious IPs

## 📚 Additional Resources

- [AWS CloudWatch Logs Documentation](https://docs.aws.amazon.com/cloudwatch/logs/)
- [Winston Logger](https://github.com/winstonjs/winston)
- [CloudWatch Insights Query Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)
- [AWS Well-Architected Framework: Observability](https://docs.aws.amazon.com/wellarchitected/latest/framework/observability.html)
