terraform {
  required_version = ">= 1.6.0"
}

module "networking" {
  source = "./modules/networking"
}
