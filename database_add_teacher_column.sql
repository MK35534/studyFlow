-- Add teacher column to subjects table
-- This allows storing teacher names from Pronote sync

ALTER TABLE subjects 
ADD COLUMN IF NOT EXISTS teacher VARCHAR(255) DEFAULT NULL
AFTER name;

-- Update existing subjects from pronote lessons if available
UPDATE subjects s
INNER JOIN (
  SELECT DISTINCT subject_id, MAX(created_at) as latest
  FROM assignments
  WHERE user_id = 1
  GROUP BY subject_id
) a ON s.id = a.subject_id
SET s.teacher = NULL;

-- Show updated structure
DESCRIBE subjects;
