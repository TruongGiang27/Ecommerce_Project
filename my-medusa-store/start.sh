#!/bin/bash

echo "Running database migrations..."
npx medusa db:migrate

echo "Seeding database (if exists)..."
npm run seed || echo "Seeding failed, continuing..."

echo "Starting Medusa production server..."
npx medusa start
