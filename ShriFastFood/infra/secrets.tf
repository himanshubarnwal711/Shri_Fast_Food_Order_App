resource "aws_secretsmanager_secret" "gmail_credentials" {
  name = var.gmail_secret_name

  description = "Gmail SMTP credentials for Shri Fast Food order emails"

  tags = {
    Project = "ShriFastFood"
    Purpose = "OrderEmail"
  }
}
