# C++ Gateway Starter

This folder is for the future recharge gateway service. Do not upload this folder to
Hostinger `public_html` for the static website.

## What this service can do later

- Receive approved recharge jobs from your dashboard/API.
- Send the recharge command to a SIM modem, API provider, or operator gateway.
- Read the provider response.
- Send success, failed, or pending status back to the main server.
- Write logs for troubleshooting and audit history.

## Compile the current stub

```bash
g++ -std=c++17 recharge_gateway_stub.cpp -o recharge_gateway_stub
./recharge_gateway_stub
```

## Hosting note

Hostinger shared hosting usually does not run long-lived C++ gateway services. Use
a VPS, local Windows/Linux machine, or dedicated gateway server for this part.
