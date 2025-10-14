-- Create Offer_Number table
CREATE TABLE IF NOT EXISTS "Offer_Number" (
  template_name text NOT NULL PRIMARY KEY,
  number bigint NOT NULL
);

-- Insert initial values if not exists
INSERT INTO "Offer_Number" (template_name, number)
SELECT 'emonaev', 146
WHERE NOT EXISTS (
  SELECT 1 FROM "Offer_Number" WHERE template_name = 'emonaev'
);

INSERT INTO "Offer_Number" (template_name, number)
SELECT 'remmark', 1
WHERE NOT EXISTS (
  SELECT 1 FROM "Offer_Number" WHERE template_name = 'remmark'
);

INSERT INTO "Offer_Number" (template_name, number)
SELECT 'sdk', 387
WHERE NOT EXISTS (
  SELECT 1 FROM "Offer_Number" WHERE template_name = 'sdk'
);
