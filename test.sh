#!/bin/bash

stripe payment_intents create  \
  --amount=1099 \
  --currency=usd \
  --receipt-email="I.override.your.customer.email.settings@example.com" \
  -d "metadata[orderId]"=6735