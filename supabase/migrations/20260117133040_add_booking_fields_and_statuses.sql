/*
  # Add Missing Booking Fields and Status Values

  ## Overview
  Adds additional fields required for e-ticket generation and refund processing,
  plus new booking status enum values for the complete booking lifecycle.

  ## 1. Changes to Enums
    - Add `REFUND_INITIATED` to booking_status_enum
    - Add `REFUND_FAILED` to booking_status_enum
    - Add `CANCELLED_NO_REFUND` to booking_status_enum

  ## 2. New Columns Added to `bookings`
    - `refund_id` (text, nullable) - Paytm refund reference ID
    - `owner_name` (text, nullable) - Property owner name for e-ticket
    - `map_link` (text, nullable) - Google Maps link for property location
    - `property_address` (text, nullable) - Full property address
    - `total_amount` (numeric, nullable) - Total booking amount (for calculating due)

  ## 3. Important Notes
    - All new columns are nullable for backward compatibility
    - Existing bookings will have NULL values for new fields
    - New booking status values enable complete refund workflow
*/

-- Add new booking status enum values
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'REFUND_INITIATED' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'booking_status_enum')
  ) THEN
    ALTER TYPE booking_status_enum ADD VALUE 'REFUND_INITIATED';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'REFUND_FAILED' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'booking_status_enum')
  ) THEN
    ALTER TYPE booking_status_enum ADD VALUE 'REFUND_FAILED';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'CANCELLED_NO_REFUND' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'booking_status_enum')
  ) THEN
    ALTER TYPE booking_status_enum ADD VALUE 'CANCELLED_NO_REFUND';
  END IF;
END $$;

-- Add refund_id column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'refund_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN refund_id text;
  END IF;
END $$;

-- Add owner_name column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'owner_name'
  ) THEN
    ALTER TABLE bookings ADD COLUMN owner_name text;
  END IF;
END $$;

-- Add map_link column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'map_link'
  ) THEN
    ALTER TABLE bookings ADD COLUMN map_link text;
  END IF;
END $$;

-- Add property_address column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'property_address'
  ) THEN
    ALTER TABLE bookings ADD COLUMN property_address text;
  END IF;
END $$;

-- Add total_amount column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'total_amount'
  ) THEN
    ALTER TABLE bookings ADD COLUMN total_amount numeric(10, 2);
  END IF;
END $$;

-- Create index for refund_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_refund_id ON bookings(refund_id) WHERE refund_id IS NOT NULL;

-- Create index for order_id for faster payment callback lookups
CREATE INDEX IF NOT EXISTS idx_bookings_order_id ON bookings(order_id) WHERE order_id IS NOT NULL;
