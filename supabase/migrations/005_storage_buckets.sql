-- Create storage buckets for audio and images
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio', 'audio', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Audio bucket policies
-- ---------------------------------------------------------------

-- Anyone can read audio files (public)
CREATE POLICY "Public read access on audio"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'audio');

-- Authenticated users can upload to their own folder
CREATE POLICY "Authenticated users upload own audio"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'audio'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can update their own audio files
CREATE POLICY "Authenticated users update own audio"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'audio'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can delete their own audio files
CREATE POLICY "Authenticated users delete own audio"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'audio'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------
-- Images bucket policies
-- ---------------------------------------------------------------

-- Anyone can read images (public)
CREATE POLICY "Public read access on images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Authenticated users can upload to their own folder
CREATE POLICY "Authenticated users upload own images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can update their own images
CREATE POLICY "Authenticated users update own images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can delete their own images
CREATE POLICY "Authenticated users delete own images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
