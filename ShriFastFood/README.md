# Shri Fast Food Order App 🍔

A full-stack food ordering application built with **React** and a **serverless AWS backend**.

The application allows customers to browse the food menu, add items to their cart, enter their contact information, and place an order.

The backend is designed using AWS Lambda, API Gateway, and DynamoDB, with infrastructure managed through Terraform.

---

## 🚀 Features

- Browse available food items
- Food item name, description, and price
- Add food items to cart
- Increase/decrease item quantities
- Remove items from cart
- View total order amount
- Checkout form
- Customer name, phone number, and email validation
- Phone number validation
- Order confirmation
- Responsive React UI
- Serverless AWS backend
- DynamoDB-based food menu
- REST API through Amazon API Gateway
- AWS Lambda backend
- Infrastructure managed using Terraform
- CORS-enabled API
- CloudWatch logging

---

# 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │                     │
                    │    React Frontend   │
                    │                     │
                    └──────────┬──────────┘
                               │
                               │ HTTPS
                               ▼
                    ┌─────────────────────┐
                    │                     │
                    │   Amazon API        │
                    │     Gateway         │
                    │                     │
                    └──────────┬──────────┘
                               │
                               │ Invoke
                               ▼
                    ┌─────────────────────┐
                    │                     │
                    │    AWS Lambda       │
                    │   Meals Function    │
                    │                     │
                    └──────────┬──────────┘
                               │
                               │ Scan
                               ▼
                    ┌─────────────────────┐
                    │                     │
                    │     DynamoDB        │
                    │     mealsList       │
                    │                     │
                    └─────────────────────┘

```
