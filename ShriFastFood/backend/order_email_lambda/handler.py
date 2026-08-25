import os
import json
import boto3
import smtplib
import html

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


# ============================================================
# ENVIRONMENT VARIABLES
# ============================================================

GMAIL_SECRET_NAME = os.environ.get("GMAIL_SECRET_NAME")
OWNER_EMAIL = os.environ.get("OWNER_EMAIL")


# ============================================================
# AWS CLIENT
# ============================================================

secrets_manager = boto3.client("secretsmanager")


# ============================================================
# GET GMAIL CREDENTIALS
# ============================================================

def get_gmail_credentials():

    response = secrets_manager.get_secret_value(
        SecretId=GMAIL_SECRET_NAME
    )

    secret_string = response.get("SecretString")

    if not secret_string:
        raise Exception("Gmail secret does not contain SecretString")

    secret = json.loads(secret_string)

    sender_email = secret.get("sender_email")
    app_password = secret.get("app_password")

    if not sender_email:
        raise Exception("sender_email missing from Gmail secret")

    if not app_password:
        raise Exception("app_password missing from Gmail secret")

    return sender_email, app_password


# ============================================================
# CREATE HTML EMAIL
# ============================================================

def create_order_email(order):

    customer = order.get("customer", {})
    items = order.get("items", [])
    total_amount = order.get("totalAmount", 0)

    customer_name = customer.get("name", "Customer")
    customer_phone = customer.get("phone", "")
    customer_email = customer.get("email", "")

    # Escape user-provided values before putting them into HTML
    customer_name = html.escape(str(customer_name))
    customer_phone = html.escape(str(customer_phone))
    customer_email = html.escape(str(customer_email))

    # ========================================================
    # ORDER ITEMS
    # ========================================================

    items_html = ""

    for item in items:

        name = html.escape(str(item.get("name", "Unknown Item")))
        price = item.get("price", 0)
        quantity = item.get("quantity", 0)

        # Cart.js already provides item total.
        # If it is missing, calculate it.
        item_total = item.get(
            "total",
            float(price) * float(quantity)
        )

        items_html += f"""
        <tr>

            <td style="
                padding: 12px;
                border-bottom: 1px solid #eeeeee;
            ">
                {name}
            </td>

            <td style="
                padding: 12px;
                text-align: center;
                border-bottom: 1px solid #eeeeee;
            ">
                ₹{price}
            </td>

            <td style="
                padding: 12px;
                text-align: center;
                border-bottom: 1px solid #eeeeee;
            ">
                {quantity}
            </td>

            <td style="
                padding: 12px;
                text-align: right;
                border-bottom: 1px solid #eeeeee;
            ">
                ₹{item_total}
            </td>

        </tr>
        """

    # ========================================================
    # HTML EMAIL
    # ========================================================

    html_body = f"""
<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <title>Shri Fast Food - Order Confirmation</title>

</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
    font-family: Arial, Helvetica, sans-serif;
">

<div style="
    max-width: 700px;
    margin: 30px auto;
    background-color: #ffffff;
    border-radius: 10px;
    overflow: hidden;
">

    <!-- HEADER -->

    <div style="
        background-color: #ff6b00;
        color: white;
        padding: 25px;
        text-align: center;
    ">

        <h1 style="
            margin: 0;
            font-size: 28px;
        ">
            Shri Fast Food
        </h1>

        <p style="
            margin: 8px 0 0;
            font-size: 16px;
        ">
            Order Confirmation
        </p>

    </div>


    <!-- CONTENT -->

    <div style="padding: 30px;">

        <h2 style="
            margin-top: 0;
            color: #333333;
        ">
            Thank you, {customer_name}! 🎉
        </h2>

        <p style="
            color: #555555;
            font-size: 15px;
            line-height: 1.6;
        ">
            Your order has been received successfully.
            Below are your complete order details.
        </p>


        <!-- CUSTOMER DETAILS -->

        <div style="
            background-color: #fafafa;
            padding: 18px;
            border-radius: 8px;
            margin: 25px 0;
        ">

            <h3 style="
                margin-top: 0;
                color: #333333;
            ">
                Customer Details
            </h3>

            <p style="margin: 8px 0;">
                <strong>Name:</strong>
                {customer_name}
            </p>

            <p style="margin: 8px 0;">
                <strong>Phone:</strong>
                {customer_phone}
            </p>

            <p style="margin: 8px 0;">
                <strong>Email:</strong>
                {customer_email}
            </p>

        </div>


        <!-- ORDER SUMMARY -->

        <h3 style="
            color: #333333;
            margin-bottom: 15px;
        ">
            Order Summary
        </h3>


        <table style="
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        ">

            <thead>

                <tr style="
                    background-color: #f2f2f2;
                ">

                    <th style="
                        padding: 12px;
                        text-align: left;
                    ">
                        Item
                    </th>

                    <th style="
                        padding: 12px;
                        text-align: center;
                    ">
                        Price
                    </th>

                    <th style="
                        padding: 12px;
                        text-align: center;
                    ">
                        Qty
                    </th>

                    <th style="
                        padding: 12px;
                        text-align: right;
                    ">
                        Total
                    </th>

                </tr>

            </thead>

            <tbody>

                {items_html}

            </tbody>

        </table>


        <!-- GRAND TOTAL -->

        <div style="
            margin-top: 25px;
            padding: 18px;
            background-color: #fff3e8;
            border-radius: 8px;
            text-align: right;
        ">

            <span style="
                font-size: 18px;
                font-weight: bold;
                color: #333333;
            ">
                Grand Total:
            </span>

            <span style="
                font-size: 24px;
                font-weight: bold;
                color: #ff6b00;
                margin-left: 10px;
            ">
                ₹{total_amount}
            </span>

        </div>


        <!-- MESSAGE -->

        <p style="
            margin-top: 30px;
            color: #666666;
            font-size: 14px;
            line-height: 1.6;
        ">

            We have received your order and will begin preparing it
            shortly.

            <br>
            <br>

            Thank you for choosing
            <strong>Shri Fast Food</strong>!

        </p>

    </div>


    <!-- FOOTER -->

    <div style="
        background-color: #333333;
        color: #ffffff;
        padding: 18px;
        text-align: center;
        font-size: 13px;
    ">

        © Shri Fast Food

    </div>

</div>

</body>

</html>
"""

    return html_body


# ============================================================
# CREATE PLAIN TEXT EMAIL
# ============================================================

def create_plain_text_email(order):

    customer = order.get("customer", {})
    items = order.get("items", [])
    total_amount = order.get("totalAmount", 0)

    customer_name = customer.get("name", "Customer")

    lines = []

    lines.append("SHRI FAST FOOD")
    lines.append("ORDER CONFIRMATION")
    lines.append("")
    lines.append(f"Hello {customer_name},")
    lines.append("")
    lines.append("Thank you for your order.")
    lines.append("")
    lines.append("CUSTOMER DETAILS")
    lines.append("----------------")
    lines.append(f"Name: {customer.get('name', '')}")
    lines.append(f"Phone: {customer.get('phone', '')}")
    lines.append(f"Email: {customer.get('email', '')}")
    lines.append("")
    lines.append("ORDER SUMMARY")
    lines.append("-------------")

    for item in items:

        name = item.get("name", "Unknown Item")
        price = item.get("price", 0)
        quantity = item.get("quantity", 0)

        item_total = item.get(
            "total",
            float(price) * float(quantity)
        )

        lines.append(
            f"{name} | ₹{price} x {quantity} = ₹{item_total}"
        )

    lines.append("")
    lines.append(f"GRAND TOTAL: ₹{total_amount}")
    lines.append("")
    lines.append("Thank you for choosing Shri Fast Food!")

    return "\n".join(lines)


# ============================================================
# SEND EMAIL
# ============================================================

def send_email(
    sender_email,
    app_password,
    customer_email,
    owner_email,
    customer_name,
    html_body,
    plain_text
):

    subject = (
        f"Shri Fast Food - Order Confirmation for {customer_name}"
    )

    # ========================================================
    # MIME MESSAGE
    # ========================================================

    message = MIMEMultipart("alternative")

    message["From"] = sender_email
    message["To"] = customer_email
    message["Cc"] = owner_email
    message["Subject"] = subject

    # Plain text version
    message.attach(
        MIMEText(
            plain_text,
            "plain",
            "utf-8"
        )
    )

    # HTML version
    message.attach(
        MIMEText(
            html_body,
            "html",
            "utf-8"
        )
    )

    # ========================================================
    # GMAIL SMTP
    # ========================================================

    server = smtplib.SMTP(
        "smtp.gmail.com",
        587,
        timeout=20
    )

    try:

        server.starttls()

        server.login(
            sender_email,
            app_password
        )

        server.send_message(message)

    finally:

        server.quit()


# ============================================================
# API RESPONSE
# ============================================================

def response(status_code, body):

    return {
        "statusCode": status_code,

        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST,OPTIONS"
        },

        "body": json.dumps(body)
    }


# ============================================================
# LAMBDA HANDLER
# ============================================================

def lambda_handler(event, context):

    print("Received order event")

    try:

        # ====================================================
        # ENVIRONMENT VARIABLES
        # ====================================================

        if not GMAIL_SECRET_NAME:

            raise Exception(
                "GMAIL_SECRET_NAME environment variable is not configured"
            )

        if not OWNER_EMAIL:

            raise Exception(
                "OWNER_EMAIL environment variable is not configured"
            )


        # ====================================================
        # HANDLE OPTIONS
        # ====================================================

        if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":

            return response(
                200,
                {
                    "success": True
                }
            )


        # ====================================================
        # GET REQUEST BODY
        # ====================================================

        body = event.get("body")

        if not body:

            raise Exception(
                "Request body is missing"
            )

        # API Gateway normally sends body as string
        if isinstance(body, str):

            try:

                order = json.loads(body)

            except json.JSONDecodeError:

                raise Exception(
                    "Request body contains invalid JSON"
                )

        else:

            order = body


        # ====================================================
        # LOG ORDER
        # ====================================================

        print(
            "Order received:",
            json.dumps(order)
        )


        # ====================================================
        # VALIDATE CUSTOMER
        # ====================================================

        customer = order.get("customer", {})

        customer_name = customer.get("name")
        customer_email = customer.get("email")
        customer_phone = customer.get("phone")


        if not customer_name:

            raise Exception(
                "Customer name is missing"
            )

        if not customer_email:

            raise Exception(
                "Customer email is missing"
            )

        if not customer_phone:

            raise Exception(
                "Customer phone is missing"
            )


        # ====================================================
        # VALIDATE ITEMS
        # ====================================================

        items = order.get("items", [])

        if not isinstance(items, list) or len(items) == 0:

            raise Exception(
                "Order contains no items"
            )


        # ====================================================
        # VALIDATE TOTAL
        # ====================================================

        total_amount = order.get("totalAmount")

        if total_amount is None:

            raise Exception(
                "totalAmount is missing"
            )


        # ====================================================
        # GET GMAIL CREDENTIALS
        # ====================================================

        sender_email, app_password = get_gmail_credentials()


        # ====================================================
        # CREATE EMAIL
        # ====================================================

        html_body = create_order_email(order)

        plain_text = create_plain_text_email(order)


        # ====================================================
        # SEND EMAIL
        # ====================================================

        send_email(
            sender_email=sender_email,
            app_password=app_password,
            customer_email=customer_email,
            owner_email=OWNER_EMAIL,
            customer_name=customer_name,
            html_body=html_body,
            plain_text=plain_text
        )


        # ====================================================
        # SUCCESS LOG
        # ====================================================

        print(
            f"Order confirmation sent successfully to {customer_email}"
        )

        print(
            f"Order copy sent successfully to owner"
        )


        # ====================================================
        # SUCCESS RESPONSE
        # ====================================================

        return response(
            200,
            {
                "success": True,
                "message": "Order confirmation email sent successfully"
            }
        )


    except Exception as error:

        # IMPORTANT:
        # Never print Gmail password or secret contents.

        print(
            "ERROR:",
            str(error)
        )

        return response(
            500,
            {
                "success": False,
                "message": "Failed to send order confirmation email"
            }
        )