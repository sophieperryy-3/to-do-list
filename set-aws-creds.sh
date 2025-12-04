#!/bin/bash
# Script to set AWS credentials cleanly

echo "Paste your AWS_ACCESS_KEY_ID (starts with ASIA):"
read -r ACCESS_KEY

echo "Paste your AWS_SECRET_ACCESS_KEY:"
read -r SECRET_KEY

echo "Paste your AWS_SESSION_TOKEN (very long):"
read -r SESSION_TOKEN

# Write to credentials file
mkdir -p ~/.aws
cat > ~/.aws/credentials << EOF
[default]
aws_access_key_id = ${ACCESS_KEY}
aws_secret_access_key = ${SECRET_KEY}
aws_session_token = ${SESSION_TOKEN}
EOF

echo ""
echo "✅ Credentials saved to ~/.aws/credentials"
echo ""
echo "Testing credentials..."
aws sts get-caller-identity

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Credentials work! You can now deploy."
else
    echo ""
    echo "❌ Credentials failed. Please try again."
fi
