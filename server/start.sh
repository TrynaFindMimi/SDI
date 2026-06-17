#!/bin/sh
npx prisma generate && npx prisma db push && npx prisma db seed && npm run start