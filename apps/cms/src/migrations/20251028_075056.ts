import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
    await db.execute(sql`
   CREATE TYPE "public"."enum_orders_timeline_type" AS ENUM('note', 'order_created', 'order_paid', 'order_cancelled', 'refund_issued', 'fulfillment_started', 'shipped', 'delivered', 'return_requested', 'return_completed', 'other');
  CREATE TYPE "public"."enum_orders_source" AS ENUM('manual');
  CREATE TYPE "public"."enum_orders_payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');
  CREATE TYPE "public"."enum_orders_order_status" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'canceled');
  CREATE TYPE "public"."enum_products_sales_channels" AS ENUM('all', 'onlineStore', 'pos', 'mobileApp');
  CREATE TYPE "public"."enum_products_source" AS ENUM('manual');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'customer');
  CREATE TYPE "public"."enum_campaigns_type" AS ENUM('email', 'sms');
  CREATE TYPE "public"."enum_campaigns_status" AS ENUM('draft', 'scheduled', 'sent', 'paused');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_payments_blocks_manual_method_type" AS ENUM('cod', 'bankTransfer', 'inStore', 'other');
  CREATE TYPE "public"."enum_payments_blocks_stripe_method_type" AS ENUM('card', 'ach', 'auto');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_exports_format" AS ENUM('csv', 'json');
  CREATE TYPE "public"."enum_exports_drafts" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'createCollectionExport');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'createCollectionExport');
  CREATE TYPE "public"."enum_store_settings_currency" AS ENUM('AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BOV', 'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHE', 'CHF', 'CHW', 'CLF', 'CLP', 'CNY', 'COP', 'COU', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MXV', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLE', 'SOS', 'SRD', 'SSP', 'STN', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'USN', 'UYI', 'UYU', 'UYW', 'UZS', 'VED', 'VES', 'VND', 'VUV', 'WST', 'XAF', 'XAG', 'XAU', 'XBA', 'XBB', 'XBC', 'XBD', 'XCD', 'XDR', 'XOF', 'XPD', 'XPF', 'XPT', 'XSU', 'XTS', 'XUA', 'XXX', 'YER', 'ZAR', 'ZMW', 'ZWG');
  CREATE TYPE "public"."enum_main_menu_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_main_menu_nav_items_link_appearance" AS ENUM('default', 'primary', 'secondary');
  CREATE TABLE "orders_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"type" "enum_orders_timeline_type" NOT NULL,
  	"created_by_id" integer,
  	"details" varchar
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_id" varchar NOT NULL,
  	"total_amount" numeric NOT NULL,
  	"user_id" integer,
  	"cart_id" integer,
  	"source" "enum_orders_source" DEFAULT 'manual',
  	"currency" varchar NOT NULL,
  	"payment_status" "enum_orders_payment_status" DEFAULT 'pending' NOT NULL,
  	"order_status" "enum_orders_order_status" DEFAULT 'pending' NOT NULL,
  	"payment_id" integer,
  	"shipping_id" integer,
  	"payment_intent_id" varchar,
  	"session_id" varchar,
  	"session_url" varchar,
  	"payment_method" varchar,
  	"receipt_url" varchar,
  	"metadata" jsonb,
  	"shipping_address" jsonb,
  	"billing_address" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "collections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar DEFAULT '' NOT NULL,
  	"visible" boolean DEFAULT true,
  	"thumbnail_id" integer,
  	"image_url" varchar,
  	"handle" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_sales_channels" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_products_sales_channels",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_variant_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"option" varchar NOT NULL
  );
  
  CREATE TABLE "products_variants_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"option" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "products_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"vid" varchar,
  	"sku" varchar,
  	"image_url" varchar,
  	"price" numeric NOT NULL,
  	"original_price" numeric,
  	"stock_count" numeric DEFAULT 0
  );
  
  CREATE TABLE "products_custom_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"pid" varchar,
  	"title" varchar NOT NULL,
  	"currency" varchar,
  	"visible" boolean DEFAULT true,
  	"source" "enum_products_source" DEFAULT 'manual',
  	"description" varchar NOT NULL,
  	"handle" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"collections_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "campaigns" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_campaigns_type" DEFAULT 'email' NOT NULL,
  	"status" "enum_campaigns_status" DEFAULT 'draft',
  	"subject" varchar,
  	"email_template_id" integer,
  	"profile_from" varchar,
  	"profile_reply_to" varchar,
  	"template_data" jsonb,
  	"metrics_sent" numeric DEFAULT 0,
  	"metrics_opened" numeric DEFAULT 0,
  	"metrics_clicked" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "campaigns_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "policies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"handle" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "gift_cards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"value" numeric NOT NULL,
  	"customer_id" integer,
  	"expiry_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "themes_blocks_custom_storefront_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "themes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Themes',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "themes_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "carts_cart_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant_id" varchar NOT NULL,
  	"product_id" integer NOT NULL,
  	"quantity" numeric NOT NULL
  );
  
  CREATE TABLE "carts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"session_id" varchar,
  	"customer_id" integer,
  	"completed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "hero_page_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"subtitle2" varchar,
  	"cta_button_text" varchar,
  	"cta_button_link" varchar,
  	"background_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "hero_page_blocks_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"background_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "hero_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "hero_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "footer_page_blocks_basic_footer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"copyright" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "privacy_policy_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"handle" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "terms_and_conditions_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"handle" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "support_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"handle" varchar,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"form_id" integer,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_form_id" integer,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "plugins" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"enabled" boolean,
  	"plugin_id" varchar,
  	"svg_icon" varchar,
  	"category" varchar,
  	"author" varchar,
  	"license" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payments_blocks_manual_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "payments_blocks_manual" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"method_type" "enum_payments_blocks_manual_method_type" NOT NULL,
  	"instructions" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "payments_blocks_stripe" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"provider_name" varchar DEFAULT 'Stripe' NOT NULL,
  	"test_mode" boolean,
  	"method_type" "enum_payments_blocks_stripe_method_type" DEFAULT 'auto',
  	"stripe_secret_key" varchar NOT NULL,
  	"stripe_webhooks_endpoint_secret" varchar NOT NULL,
  	"publishable_key" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "payments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"coordinates" geometry(Point),
  	"contact_phone" varchar,
  	"hours" varchar,
  	"enabled" boolean DEFAULT true,
  	"is_pickup_location" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "shipping_blocks_custom_shipping" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"base_rate" numeric NOT NULL,
  	"free_shipping_min_order" numeric,
  	"estimated_delivery_days" varchar,
  	"notes" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shipping" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"location_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "checkout_sessions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"session_id" varchar,
  	"customer_id" integer,
  	"cart_id" integer NOT NULL,
  	"shipping_id" integer,
  	"payment_id" integer,
  	"shipping_address" jsonb,
  	"billing_address" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar,
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"submit_button_label" varchar,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"confirmation_message" jsonb,
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "exports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"format" "enum_exports_format" DEFAULT 'csv' NOT NULL,
  	"limit" numeric,
  	"sort" varchar,
  	"drafts" "enum_exports_drafts" DEFAULT 'yes',
  	"collection_slug" varchar NOT NULL,
  	"where" jsonb DEFAULT '{}'::jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "exports_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "email_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"html" varchar,
  	"json" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"orders_id" integer,
  	"collections_id" integer,
  	"products_id" integer,
  	"users_id" integer,
  	"campaigns_id" integer,
  	"media_id" integer,
  	"policies_id" integer,
  	"gift_cards_id" integer,
  	"themes_id" integer,
  	"carts_id" integer,
  	"hero_page_id" integer,
  	"footer_page_id" integer,
  	"privacy_policy_page_id" integer,
  	"terms_and_conditions_page_id" integer,
  	"support_page_id" integer,
  	"pages_id" integer,
  	"plugins_id" integer,
  	"payments_id" integer,
  	"locations_id" integer,
  	"shipping_id" integer,
  	"checkout_sessions_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer,
  	"exports_id" integer,
  	"email_templates_id" integer,
  	"payload_jobs_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "store_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Vya-dove',
  	"currency" "enum_store_settings_currency" DEFAULT 'USD',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "main_menu_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "main_menu_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_main_menu_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL,
  	"link_appearance" "enum_main_menu_nav_items_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "main_menu" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_submissions_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "main_menu_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  ALTER TABLE "orders_timeline" ADD CONSTRAINT "orders_timeline_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_timeline" ADD CONSTRAINT "orders_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_cart_id_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_id_shipping_id_fk" FOREIGN KEY ("shipping_id") REFERENCES "public"."shipping"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collections" ADD CONSTRAINT "collections_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_sales_channels" ADD CONSTRAINT "products_sales_channels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variant_options" ADD CONSTRAINT "products_variant_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variants_options" ADD CONSTRAINT "products_variants_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_custom_fields" ADD CONSTRAINT "products_custom_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_texts" ADD CONSTRAINT "products_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_collections_fk" FOREIGN KEY ("collections_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_email_template_id_email_templates_id_fk" FOREIGN KEY ("email_template_id") REFERENCES "public"."email_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "campaigns_rels" ADD CONSTRAINT "campaigns_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "campaigns_rels" ADD CONSTRAINT "campaigns_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gift_cards" ADD CONSTRAINT "gift_cards_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "themes_blocks_custom_storefront_block" ADD CONSTRAINT "themes_blocks_custom_storefront_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "themes_texts" ADD CONSTRAINT "themes_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "carts_cart_items" ADD CONSTRAINT "carts_cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "carts_cart_items" ADD CONSTRAINT "carts_cart_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "carts" ADD CONSTRAINT "carts_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_page_blocks_hero" ADD CONSTRAINT "hero_page_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_page_blocks_hero" ADD CONSTRAINT "hero_page_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_page_blocks_carousel" ADD CONSTRAINT "hero_page_blocks_carousel_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_page_blocks_carousel" ADD CONSTRAINT "hero_page_blocks_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_page_rels" ADD CONSTRAINT "hero_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."hero_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_page_rels" ADD CONSTRAINT "hero_page_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_page_blocks_basic_footer" ADD CONSTRAINT "footer_page_blocks_basic_footer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_form_id_forms_id_fk" FOREIGN KEY ("version_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments_blocks_manual_details" ADD CONSTRAINT "payments_blocks_manual_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payments_blocks_manual"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payments_blocks_manual" ADD CONSTRAINT "payments_blocks_manual_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payments_blocks_stripe" ADD CONSTRAINT "payments_blocks_stripe_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shipping_blocks_custom_shipping" ADD CONSTRAINT "shipping_blocks_custom_shipping_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shipping"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shipping" ADD CONSTRAINT "shipping_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_cart_id_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_shipping_id_shipping_id_fk" FOREIGN KEY ("shipping_id") REFERENCES "public"."shipping"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exports_texts" ADD CONSTRAINT "exports_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_collections_fk" FOREIGN KEY ("collections_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_campaigns_fk" FOREIGN KEY ("campaigns_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_policies_fk" FOREIGN KEY ("policies_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gift_cards_fk" FOREIGN KEY ("gift_cards_id") REFERENCES "public"."gift_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_themes_fk" FOREIGN KEY ("themes_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_carts_fk" FOREIGN KEY ("carts_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hero_page_fk" FOREIGN KEY ("hero_page_id") REFERENCES "public"."hero_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_footer_page_fk" FOREIGN KEY ("footer_page_id") REFERENCES "public"."footer_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_privacy_policy_page_fk" FOREIGN KEY ("privacy_policy_page_id") REFERENCES "public"."privacy_policy_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_terms_and_conditions_page_fk" FOREIGN KEY ("terms_and_conditions_page_id") REFERENCES "public"."terms_and_conditions_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_support_page_fk" FOREIGN KEY ("support_page_id") REFERENCES "public"."support_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_plugins_fk" FOREIGN KEY ("plugins_id") REFERENCES "public"."plugins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payments_fk" FOREIGN KEY ("payments_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_shipping_fk" FOREIGN KEY ("shipping_id") REFERENCES "public"."shipping"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_checkout_sessions_fk" FOREIGN KEY ("checkout_sessions_id") REFERENCES "public"."checkout_sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_exports_fk" FOREIGN KEY ("exports_id") REFERENCES "public"."exports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_templates_fk" FOREIGN KEY ("email_templates_id") REFERENCES "public"."email_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk" FOREIGN KEY ("payload_jobs_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu_blocks_form_block" ADD CONSTRAINT "main_menu_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "main_menu_blocks_form_block" ADD CONSTRAINT "main_menu_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu_nav_items" ADD CONSTRAINT "main_menu_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu" ADD CONSTRAINT "main_menu_form_submissions_id_form_submissions_id_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "main_menu_rels" ADD CONSTRAINT "main_menu_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."main_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu_rels" ADD CONSTRAINT "main_menu_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "orders_timeline_order_idx" ON "orders_timeline" USING btree ("_order");
  CREATE INDEX "orders_timeline_parent_id_idx" ON "orders_timeline" USING btree ("_parent_id");
  CREATE INDEX "orders_timeline_created_by_idx" ON "orders_timeline" USING btree ("created_by_id");
  CREATE UNIQUE INDEX "orders_order_id_idx" ON "orders" USING btree ("order_id");
  CREATE INDEX "orders_user_idx" ON "orders" USING btree ("user_id");
  CREATE INDEX "orders_cart_idx" ON "orders" USING btree ("cart_id");
  CREATE INDEX "orders_payment_idx" ON "orders" USING btree ("payment_id");
  CREATE INDEX "orders_shipping_idx" ON "orders" USING btree ("shipping_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "collections_thumbnail_idx" ON "collections" USING btree ("thumbnail_id");
  CREATE INDEX "collections_handle_idx" ON "collections" USING btree ("handle");
  CREATE INDEX "collections_updated_at_idx" ON "collections" USING btree ("updated_at");
  CREATE INDEX "collections_created_at_idx" ON "collections" USING btree ("created_at");
  CREATE INDEX "products_sales_channels_order_idx" ON "products_sales_channels" USING btree ("order");
  CREATE INDEX "products_sales_channels_parent_idx" ON "products_sales_channels" USING btree ("parent_id");
  CREATE INDEX "products_variant_options_order_idx" ON "products_variant_options" USING btree ("_order");
  CREATE INDEX "products_variant_options_parent_id_idx" ON "products_variant_options" USING btree ("_parent_id");
  CREATE INDEX "products_variants_options_order_idx" ON "products_variants_options" USING btree ("_order");
  CREATE INDEX "products_variants_options_parent_id_idx" ON "products_variants_options" USING btree ("_parent_id");
  CREATE INDEX "products_variants_order_idx" ON "products_variants" USING btree ("_order");
  CREATE INDEX "products_variants_parent_id_idx" ON "products_variants" USING btree ("_parent_id");
  CREATE INDEX "products_custom_fields_order_idx" ON "products_custom_fields" USING btree ("_order");
  CREATE INDEX "products_custom_fields_parent_id_idx" ON "products_custom_fields" USING btree ("_parent_id");
  CREATE INDEX "products_handle_idx" ON "products" USING btree ("handle");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products_texts_order_parent_idx" ON "products_texts" USING btree ("order","parent_id");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_collections_id_idx" ON "products_rels" USING btree ("collections_id");
  CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "campaigns_email_template_idx" ON "campaigns" USING btree ("email_template_id");
  CREATE INDEX "campaigns_updated_at_idx" ON "campaigns" USING btree ("updated_at");
  CREATE INDEX "campaigns_created_at_idx" ON "campaigns" USING btree ("created_at");
  CREATE INDEX "campaigns_rels_order_idx" ON "campaigns_rels" USING btree ("order");
  CREATE INDEX "campaigns_rels_parent_idx" ON "campaigns_rels" USING btree ("parent_id");
  CREATE INDEX "campaigns_rels_path_idx" ON "campaigns_rels" USING btree ("path");
  CREATE INDEX "campaigns_rels_users_id_idx" ON "campaigns_rels" USING btree ("users_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "policies_handle_idx" ON "policies" USING btree ("handle");
  CREATE INDEX "policies_updated_at_idx" ON "policies" USING btree ("updated_at");
  CREATE INDEX "policies_created_at_idx" ON "policies" USING btree ("created_at");
  CREATE INDEX "gift_cards_customer_idx" ON "gift_cards" USING btree ("customer_id");
  CREATE INDEX "gift_cards_updated_at_idx" ON "gift_cards" USING btree ("updated_at");
  CREATE INDEX "gift_cards_created_at_idx" ON "gift_cards" USING btree ("created_at");
  CREATE INDEX "themes_blocks_custom_storefront_block_order_idx" ON "themes_blocks_custom_storefront_block" USING btree ("_order");
  CREATE INDEX "themes_blocks_custom_storefront_block_parent_id_idx" ON "themes_blocks_custom_storefront_block" USING btree ("_parent_id");
  CREATE INDEX "themes_blocks_custom_storefront_block_path_idx" ON "themes_blocks_custom_storefront_block" USING btree ("_path");
  CREATE INDEX "themes_updated_at_idx" ON "themes" USING btree ("updated_at");
  CREATE INDEX "themes_created_at_idx" ON "themes" USING btree ("created_at");
  CREATE INDEX "themes_texts_order_parent_idx" ON "themes_texts" USING btree ("order","parent_id");
  CREATE INDEX "carts_cart_items_order_idx" ON "carts_cart_items" USING btree ("_order");
  CREATE INDEX "carts_cart_items_parent_id_idx" ON "carts_cart_items" USING btree ("_parent_id");
  CREATE INDEX "carts_cart_items_product_idx" ON "carts_cart_items" USING btree ("product_id");
  CREATE INDEX "carts_customer_idx" ON "carts" USING btree ("customer_id");
  CREATE INDEX "carts_updated_at_idx" ON "carts" USING btree ("updated_at");
  CREATE INDEX "carts_created_at_idx" ON "carts" USING btree ("created_at");
  CREATE INDEX "hero_page_blocks_hero_order_idx" ON "hero_page_blocks_hero" USING btree ("_order");
  CREATE INDEX "hero_page_blocks_hero_parent_id_idx" ON "hero_page_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "hero_page_blocks_hero_path_idx" ON "hero_page_blocks_hero" USING btree ("_path");
  CREATE INDEX "hero_page_blocks_hero_background_image_idx" ON "hero_page_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX "hero_page_blocks_carousel_order_idx" ON "hero_page_blocks_carousel" USING btree ("_order");
  CREATE INDEX "hero_page_blocks_carousel_parent_id_idx" ON "hero_page_blocks_carousel" USING btree ("_parent_id");
  CREATE INDEX "hero_page_blocks_carousel_path_idx" ON "hero_page_blocks_carousel" USING btree ("_path");
  CREATE INDEX "hero_page_blocks_carousel_background_image_idx" ON "hero_page_blocks_carousel" USING btree ("background_image_id");
  CREATE INDEX "hero_page_updated_at_idx" ON "hero_page" USING btree ("updated_at");
  CREATE INDEX "hero_page_created_at_idx" ON "hero_page" USING btree ("created_at");
  CREATE INDEX "hero_page_rels_order_idx" ON "hero_page_rels" USING btree ("order");
  CREATE INDEX "hero_page_rels_parent_idx" ON "hero_page_rels" USING btree ("parent_id");
  CREATE INDEX "hero_page_rels_path_idx" ON "hero_page_rels" USING btree ("path");
  CREATE INDEX "hero_page_rels_media_id_idx" ON "hero_page_rels" USING btree ("media_id");
  CREATE INDEX "footer_page_blocks_basic_footer_order_idx" ON "footer_page_blocks_basic_footer" USING btree ("_order");
  CREATE INDEX "footer_page_blocks_basic_footer_parent_id_idx" ON "footer_page_blocks_basic_footer" USING btree ("_parent_id");
  CREATE INDEX "footer_page_blocks_basic_footer_path_idx" ON "footer_page_blocks_basic_footer" USING btree ("_path");
  CREATE INDEX "footer_page_updated_at_idx" ON "footer_page" USING btree ("updated_at");
  CREATE INDEX "footer_page_created_at_idx" ON "footer_page" USING btree ("created_at");
  CREATE INDEX "privacy_policy_page_handle_idx" ON "privacy_policy_page" USING btree ("handle");
  CREATE INDEX "privacy_policy_page_updated_at_idx" ON "privacy_policy_page" USING btree ("updated_at");
  CREATE INDEX "privacy_policy_page_created_at_idx" ON "privacy_policy_page" USING btree ("created_at");
  CREATE INDEX "terms_and_conditions_page_handle_idx" ON "terms_and_conditions_page" USING btree ("handle");
  CREATE INDEX "terms_and_conditions_page_updated_at_idx" ON "terms_and_conditions_page" USING btree ("updated_at");
  CREATE INDEX "terms_and_conditions_page_created_at_idx" ON "terms_and_conditions_page" USING btree ("created_at");
  CREATE INDEX "support_page_handle_idx" ON "support_page" USING btree ("handle");
  CREATE INDEX "support_page_updated_at_idx" ON "support_page" USING btree ("updated_at");
  CREATE INDEX "support_page_created_at_idx" ON "support_page" USING btree ("created_at");
  CREATE INDEX "pages_blocks_form_block_order_idx" ON "pages_blocks_form_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_block_parent_id_idx" ON "pages_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_block_path_idx" ON "pages_blocks_form_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_form_idx" ON "pages_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "pages_form_idx" ON "pages" USING btree ("form_id");
  CREATE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_blocks_form_block_order_idx" ON "_pages_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_block_parent_id_idx" ON "_pages_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_block_path_idx" ON "_pages_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_form_idx" ON "_pages_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_form_idx" ON "_pages_v" USING btree ("version_form_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "plugins_updated_at_idx" ON "plugins" USING btree ("updated_at");
  CREATE INDEX "plugins_created_at_idx" ON "plugins" USING btree ("created_at");
  CREATE INDEX "payments_blocks_manual_details_order_idx" ON "payments_blocks_manual_details" USING btree ("_order");
  CREATE INDEX "payments_blocks_manual_details_parent_id_idx" ON "payments_blocks_manual_details" USING btree ("_parent_id");
  CREATE INDEX "payments_blocks_manual_order_idx" ON "payments_blocks_manual" USING btree ("_order");
  CREATE INDEX "payments_blocks_manual_parent_id_idx" ON "payments_blocks_manual" USING btree ("_parent_id");
  CREATE INDEX "payments_blocks_manual_path_idx" ON "payments_blocks_manual" USING btree ("_path");
  CREATE INDEX "payments_blocks_stripe_order_idx" ON "payments_blocks_stripe" USING btree ("_order");
  CREATE INDEX "payments_blocks_stripe_parent_id_idx" ON "payments_blocks_stripe" USING btree ("_parent_id");
  CREATE INDEX "payments_blocks_stripe_path_idx" ON "payments_blocks_stripe" USING btree ("_path");
  CREATE INDEX "payments_updated_at_idx" ON "payments" USING btree ("updated_at");
  CREATE INDEX "payments_created_at_idx" ON "payments" USING btree ("created_at");
  CREATE INDEX "locations_updated_at_idx" ON "locations" USING btree ("updated_at");
  CREATE INDEX "locations_created_at_idx" ON "locations" USING btree ("created_at");
  CREATE INDEX "shipping_blocks_custom_shipping_order_idx" ON "shipping_blocks_custom_shipping" USING btree ("_order");
  CREATE INDEX "shipping_blocks_custom_shipping_parent_id_idx" ON "shipping_blocks_custom_shipping" USING btree ("_parent_id");
  CREATE INDEX "shipping_blocks_custom_shipping_path_idx" ON "shipping_blocks_custom_shipping" USING btree ("_path");
  CREATE INDEX "shipping_location_idx" ON "shipping" USING btree ("location_id");
  CREATE INDEX "shipping_updated_at_idx" ON "shipping" USING btree ("updated_at");
  CREATE INDEX "shipping_created_at_idx" ON "shipping" USING btree ("created_at");
  CREATE INDEX "checkout_sessions_customer_idx" ON "checkout_sessions" USING btree ("customer_id");
  CREATE INDEX "checkout_sessions_cart_idx" ON "checkout_sessions" USING btree ("cart_id");
  CREATE INDEX "checkout_sessions_shipping_idx" ON "checkout_sessions" USING btree ("shipping_id");
  CREATE INDEX "checkout_sessions_payment_idx" ON "checkout_sessions" USING btree ("payment_id");
  CREATE INDEX "checkout_sessions_updated_at_idx" ON "checkout_sessions" USING btree ("updated_at");
  CREATE INDEX "checkout_sessions_created_at_idx" ON "checkout_sessions" USING btree ("created_at");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "exports_updated_at_idx" ON "exports" USING btree ("updated_at");
  CREATE INDEX "exports_created_at_idx" ON "exports" USING btree ("created_at");
  CREATE UNIQUE INDEX "exports_filename_idx" ON "exports" USING btree ("filename");
  CREATE INDEX "exports_texts_order_parent_idx" ON "exports_texts" USING btree ("order","parent_id");
  CREATE INDEX "email_templates_updated_at_idx" ON "email_templates" USING btree ("updated_at");
  CREATE INDEX "email_templates_created_at_idx" ON "email_templates" USING btree ("created_at");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_collections_id_idx" ON "payload_locked_documents_rels" USING btree ("collections_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_campaigns_id_idx" ON "payload_locked_documents_rels" USING btree ("campaigns_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_policies_id_idx" ON "payload_locked_documents_rels" USING btree ("policies_id");
  CREATE INDEX "payload_locked_documents_rels_gift_cards_id_idx" ON "payload_locked_documents_rels" USING btree ("gift_cards_id");
  CREATE INDEX "payload_locked_documents_rels_themes_id_idx" ON "payload_locked_documents_rels" USING btree ("themes_id");
  CREATE INDEX "payload_locked_documents_rels_carts_id_idx" ON "payload_locked_documents_rels" USING btree ("carts_id");
  CREATE INDEX "payload_locked_documents_rels_hero_page_id_idx" ON "payload_locked_documents_rels" USING btree ("hero_page_id");
  CREATE INDEX "payload_locked_documents_rels_footer_page_id_idx" ON "payload_locked_documents_rels" USING btree ("footer_page_id");
  CREATE INDEX "payload_locked_documents_rels_privacy_policy_page_id_idx" ON "payload_locked_documents_rels" USING btree ("privacy_policy_page_id");
  CREATE INDEX "payload_locked_documents_rels_terms_and_conditions_page_id_idx" ON "payload_locked_documents_rels" USING btree ("terms_and_conditions_page_id");
  CREATE INDEX "payload_locked_documents_rels_support_page_id_idx" ON "payload_locked_documents_rels" USING btree ("support_page_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_plugins_id_idx" ON "payload_locked_documents_rels" USING btree ("plugins_id");
  CREATE INDEX "payload_locked_documents_rels_payments_id_idx" ON "payload_locked_documents_rels" USING btree ("payments_id");
  CREATE INDEX "payload_locked_documents_rels_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("locations_id");
  CREATE INDEX "payload_locked_documents_rels_shipping_id_idx" ON "payload_locked_documents_rels" USING btree ("shipping_id");
  CREATE INDEX "payload_locked_documents_rels_checkout_sessions_id_idx" ON "payload_locked_documents_rels" USING btree ("checkout_sessions_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_exports_id_idx" ON "payload_locked_documents_rels" USING btree ("exports_id");
  CREATE INDEX "payload_locked_documents_rels_email_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("email_templates_id");
  CREATE INDEX "payload_locked_documents_rels_payload_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_jobs_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "main_menu_blocks_form_block_order_idx" ON "main_menu_blocks_form_block" USING btree ("_order");
  CREATE INDEX "main_menu_blocks_form_block_parent_id_idx" ON "main_menu_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "main_menu_blocks_form_block_path_idx" ON "main_menu_blocks_form_block" USING btree ("_path");
  CREATE INDEX "main_menu_blocks_form_block_form_idx" ON "main_menu_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "main_menu_nav_items_order_idx" ON "main_menu_nav_items" USING btree ("_order");
  CREATE INDEX "main_menu_nav_items_parent_id_idx" ON "main_menu_nav_items" USING btree ("_parent_id");
  CREATE INDEX "main_menu_form_submissions_idx" ON "main_menu" USING btree ("form_submissions_id");
  CREATE INDEX "main_menu_rels_order_idx" ON "main_menu_rels" USING btree ("order");
  CREATE INDEX "main_menu_rels_parent_idx" ON "main_menu_rels" USING btree ("parent_id");
  CREATE INDEX "main_menu_rels_path_idx" ON "main_menu_rels" USING btree ("path");
  CREATE INDEX "main_menu_rels_pages_id_idx" ON "main_menu_rels" USING btree ("pages_id");`);
}

export async function down({
    db,
    payload,
    req,
}: MigrateDownArgs): Promise<void> {
    await db.execute(sql`
   DROP TABLE "orders_timeline" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "collections" CASCADE;
  DROP TABLE "products_sales_channels" CASCADE;
  DROP TABLE "products_variant_options" CASCADE;
  DROP TABLE "products_variants_options" CASCADE;
  DROP TABLE "products_variants" CASCADE;
  DROP TABLE "products_custom_fields" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_texts" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "campaigns" CASCADE;
  DROP TABLE "campaigns_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "policies" CASCADE;
  DROP TABLE "gift_cards" CASCADE;
  DROP TABLE "themes_blocks_custom_storefront_block" CASCADE;
  DROP TABLE "themes" CASCADE;
  DROP TABLE "themes_texts" CASCADE;
  DROP TABLE "carts_cart_items" CASCADE;
  DROP TABLE "carts" CASCADE;
  DROP TABLE "hero_page_blocks_hero" CASCADE;
  DROP TABLE "hero_page_blocks_carousel" CASCADE;
  DROP TABLE "hero_page" CASCADE;
  DROP TABLE "hero_page_rels" CASCADE;
  DROP TABLE "footer_page_blocks_basic_footer" CASCADE;
  DROP TABLE "footer_page" CASCADE;
  DROP TABLE "privacy_policy_page" CASCADE;
  DROP TABLE "terms_and_conditions_page" CASCADE;
  DROP TABLE "support_page" CASCADE;
  DROP TABLE "pages_blocks_form_block" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "plugins" CASCADE;
  DROP TABLE "payments_blocks_manual_details" CASCADE;
  DROP TABLE "payments_blocks_manual" CASCADE;
  DROP TABLE "payments_blocks_stripe" CASCADE;
  DROP TABLE "payments" CASCADE;
  DROP TABLE "locations" CASCADE;
  DROP TABLE "shipping_blocks_custom_shipping" CASCADE;
  DROP TABLE "shipping" CASCADE;
  DROP TABLE "checkout_sessions" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "exports" CASCADE;
  DROP TABLE "exports_texts" CASCADE;
  DROP TABLE "email_templates" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "store_settings" CASCADE;
  DROP TABLE "main_menu_blocks_form_block" CASCADE;
  DROP TABLE "main_menu_nav_items" CASCADE;
  DROP TABLE "main_menu" CASCADE;
  DROP TABLE "main_menu_rels" CASCADE;
  DROP TYPE "public"."enum_orders_timeline_type";
  DROP TYPE "public"."enum_orders_source";
  DROP TYPE "public"."enum_orders_payment_status";
  DROP TYPE "public"."enum_orders_order_status";
  DROP TYPE "public"."enum_products_sales_channels";
  DROP TYPE "public"."enum_products_source";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_campaigns_type";
  DROP TYPE "public"."enum_campaigns_status";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_payments_blocks_manual_method_type";
  DROP TYPE "public"."enum_payments_blocks_stripe_method_type";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_exports_format";
  DROP TYPE "public"."enum_exports_drafts";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_store_settings_currency";
  DROP TYPE "public"."enum_main_menu_nav_items_link_type";
  DROP TYPE "public"."enum_main_menu_nav_items_link_appearance";`);
}
