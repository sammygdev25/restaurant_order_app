#!/bin/bash
set -e
echo "=== Starting restaurant_order_app ==="

# Backend
cd /workspace/backend

# Wait for PostgreSQL if DB_HOST is set
if [ -n "$DB_HOST" ]; then
    echo "Waiting for PostgreSQL..."
    for i in $(seq 1 30); do
        python -c "import socket; s=socket.create_connection(('$DB_HOST', ${DB_PORT:-5432}), 2); s.close()" 2>/dev/null && break
        sleep 1
    done
fi

echo "Installing Python dependencies..."
pip install -r requirements.txt --quiet 2>/dev/null

echo "Running migrations..."
python manage.py makemigrations api --noinput 2>&1 || true
python manage.py migrate --noinput 2>&1

echo "Collecting static files..."
python manage.py collectstatic --noinput 2>/dev/null || true

if [ "${SEED_DEMO:-0}" = "1" ]; then
echo "SEED_DEMO=1: creating demo users and loading seed data (never set this in production)"
echo "Ensuring demo user (pk=1) exists BEFORE seed load so owner FKs resolve..."
python manage.py shell -c "from django.contrib.auth import get_user_model as g; U=g(); U.objects.filter(username='demo').exists() or U.objects.create_user('demo','demo@example.com','demo123')"
echo "Loading seed data..."
if python manage.py loaddata seed_data.json 2>/tmp/seed_err.log; then
    echo "Seed data loaded successfully"
else
    echo "WARNING: seed data failed on first attempt, retrying..."
    cat /tmp/seed_err.log
    # Retry after ensuring demo user exists at pk=1
    python manage.py shell -c "
from django.contrib.auth import get_user_model
U = get_user_model()
if not U.objects.filter(pk=1).exists():
    u = U(pk=1, username='demo', email='demo@example.com')
    u.set_password('demo123')
    u.save()
    print('Created demo user at pk=1')
" 2>/dev/null
    python manage.py loaddata seed_data.json 2>&1 || echo "WARNING: seed data failed to load (see errors above)"
fi

echo "Ensuring demo user exists..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='demo').exists():
    User.objects.create_user('demo', 'demo@example.com', 'demo123')
    print('Demo user created (demo / demo123)')
else:
    print('Demo user already exists')
" 2>/dev/null
echo "Setting passwords for all users..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
for u in User.objects.all():
    u.set_password('demo123')
    u.save()
print(f'Set password demo123 for {User.objects.count()} users')
" 2>/dev/null || true
else
echo "SEED_DEMO is not 1: skipping demo users and seed data"
fi
echo "Starting Django on port 8000..."
daphne -b 0.0.0.0 -p 8000 config.asgi:application &
BACKEND_PID=$!

# Start Celery worker + beat (if Redis is reachable)
if python -c "import redis; redis.Redis.from_url('${CELERY_BROKER_URL:-redis://localhost:6379/0}').ping()" 2>/dev/null; then
    echo "Starting Celery worker..."
    celery -A config worker --loglevel=info --concurrency=2 -D
    echo "Starting Celery beat..."
    celery -A config beat --loglevel=info -D
else
    echo "Redis not available -- Celery worker/beat skipped"
fi

# Health check -- wait for Django before starting React
echo "Waiting for Django..."
for i in $(seq 1 30); do
    if curl -sf http://localhost:8000/health/ > /dev/null 2>&1; then
        echo "Django is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "WARNING: Django health check timed out"
    fi
    sleep 1
done

# Frontend
cd /workspace/frontend
echo "Installing Node dependencies..."
npm install --legacy-peer-deps --silent 2>/dev/null

echo "Starting React on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================="
echo "  Backend:  http://localhost:8000"
echo "  Frontend: http://localhost:3000"
echo "  API:      http://localhost:8000/api/"
echo "========================================="

wait $BACKEND_PID $FRONTEND_PID
