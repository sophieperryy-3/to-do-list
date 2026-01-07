# DORA Metrics Implementation

## Overview
This document explains how we implement and calculate DORA (DevOps Research and Assessment) metrics to measure our DevOps performance and drive continuous improvement.

## What are DORA Metrics?

DORA metrics are four key performance indicators that measure software delivery performance:

1. **Deployment Frequency** - How often we deploy to production
2. **Lead Time for Changes** - Time from commit to production deployment
3. **Change Failure Rate** - Percentage of deployments that cause failures
4. **Mean Time to Recovery (MTTR)** - Time to recover from failures

## Our Implementation

### 1. Deployment Frequency
**What we measure**: Number of successful deployments per day over the last 30 days

**How we calculate it**:
```bash
# Get deployments in last 30 days via GitHub API
RECENT_DEPLOYMENTS=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/owner/repo/actions/workflows/cd.yml/runs?per_page=100" \
  | jq '[.workflow_runs[] | select(.created_at > (now - 30*24*3600 | strftime("%Y-%m-%dT%H:%M:%SZ")))] | length')

FREQ_PER_DAY=$(echo "scale=2; $RECENT_DEPLOYMENTS / 30" | bc)
```

**Performance levels**:
- 🟢 **Elite**: >1 deployment per day
- 🟡 **High**: Weekly deployments
- 🟠 **Medium**: Monthly deployments
- 🔴 **Low**: Less than monthly

### 2. Lead Time for Changes
**What we measure**: Time from commit timestamp to deployment completion

**How we calculate it**:
```bash
# Get commit timestamp and deployment completion time
DEPLOY_START_TIME="${{ github.event.head_commit.timestamp }}"
DEPLOY_END_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Calculate difference in minutes using Python
LEAD_TIME_MINUTES=$(python3 -c "
from datetime import datetime
start = datetime.fromisoformat('$DEPLOY_START_TIME'.replace('Z', '+00:00'))
end = datetime.fromisoformat('$DEPLOY_END_TIME'.replace('Z', '+00:00'))
diff = (end - start).total_seconds() / 60
print(int(diff))
")
```

**Performance levels**:
- 🟢 **Elite**: <1 hour
- 🟡 **High**: <1 day
- 🟠 **Medium**: <1 week
- 🔴 **Low**: >1 week

### 3. Change Failure Rate
**What we measure**: Percentage of deployments that result in failures

**How we calculate it**:
```bash
# Get total and failed deployment runs
TOTAL_RUNS=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/owner/repo/actions/workflows/cd.yml/runs?per_page=50" \
  | jq '.workflow_runs | length')

FAILED_RUNS=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/owner/repo/actions/workflows/cd.yml/runs?per_page=50" \
  | jq '[.workflow_runs[] | select(.conclusion == "failure")] | length')

FAILURE_RATE=$(echo "scale=1; $FAILED_RUNS * 100 / $TOTAL_RUNS" | bc)
```

**Performance levels**:
- 🟢 **Elite**: <5% failure rate
- 🟡 **High**: <15% failure rate
- 🟠 **Medium**: <30% failure rate
- 🔴 **Low**: >30% failure rate

### 4. Mean Time to Recovery (MTTR)
**What we measure**: Time between a failed deployment and the next successful deployment

**How we calculate it**:
```bash
# Find last failure and next success
LAST_FAILURE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/owner/repo/actions/workflows/cd.yml/runs?per_page=20" \
  | jq -r '[.workflow_runs[] | select(.conclusion == "failure")] | .[0].created_at')

NEXT_SUCCESS=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/owner/repo/actions/workflows/cd.yml/runs?per_page=20" \
  | jq -r --arg failure_time "$LAST_FAILURE" \
  '[.workflow_runs[] | select(.conclusion == "success" and .created_at > $failure_time)] | .[0].created_at')

# Calculate time difference
MTTR_HOURS=$(python3 -c "
from datetime import datetime
failure = datetime.fromisoformat('$LAST_FAILURE'.replace('Z', '+00:00'))
success = datetime.fromisoformat('$NEXT_SUCCESS'.replace('Z', '+00:00'))
diff = (success - failure).total_seconds() / 3600
print(f'{diff:.1f}')
")
```

**Performance levels**:
- 🟢 **Elite**: <1 hour
- 🟡 **High**: <1 day
- 🟠 **Medium**: <1 week
- 🔴 **Low**: >1 week

## Why DORA Metrics Matter

### Business Impact
- **Faster delivery** = Quicker time to market
- **Higher reliability** = Better customer experience
- **Faster recovery** = Reduced downtime costs
- **Data-driven decisions** = Continuous improvement

### DevOps Maturity
DORA metrics help us:
- Identify bottlenecks in our delivery pipeline
- Measure the impact of process improvements
- Benchmark against industry standards
- Drive cultural change toward continuous delivery

### Continuous Improvement
We use these metrics to:
1. **Set targets** for each metric
2. **Track progress** over time
3. **Identify trends** and patterns
4. **Make data-driven decisions** about tooling and processes

## Integration with CI/CD

Our DORA metrics are automatically calculated and displayed in every deployment:

1. **GitHub Actions Integration**: Metrics calculated in `dora-metrics` job
2. **Step Summary Display**: Results shown in GitHub UI
3. **Historical Tracking**: Data collected from GitHub API
4. **Performance Ratings**: Color-coded performance levels

## Viewing Metrics

Metrics are displayed in:
- **GitHub Actions Summary**: After each deployment
- **Workflow Logs**: Detailed calculations
- **This Documentation**: Understanding and context

## Future Enhancements

Potential improvements:
- **Dashboard**: Grafana/CloudWatch dashboard for historical trends
- **Alerts**: Notifications when metrics degrade
- **Team Metrics**: Per-team or per-feature tracking
- **External Storage**: Store metrics in database for advanced analytics

## References

- [DORA State of DevOps Report](https://cloud.google.com/devops/state-of-devops)
- [Accelerate Book](https://itrevolution.com/accelerate-book/)
- [GitHub API Documentation](https://docs.github.com/en/rest)