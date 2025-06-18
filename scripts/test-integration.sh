
#!/bin/bash

echo "🧪 Running Integration Tests..."

# Install test dependencies if not present
if [ ! -f "node_modules/.bin/jest" ]; then
  echo "📦 Installing test dependencies..."
  npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom
fi

# Run the integration tests
echo "🚀 Starting integration test suite..."
npx jest tests/integration/ --verbose --coverage

# Check if tests passed
if [ $? -eq 0 ]; then
  echo "✅ All integration tests passed!"
else
  echo "❌ Some integration tests failed!"
  exit 1
fi
