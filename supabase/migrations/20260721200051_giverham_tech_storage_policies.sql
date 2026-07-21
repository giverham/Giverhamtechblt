/*
# Storage RLS policies for media bucket

Allows authenticated users to upload/delete from the media bucket,
and allows public (anon) read access to media files.
*/

DROP POLICY IF EXISTS "media_objects_select" ON storage.objects;
CREATE POLICY "media_objects_select" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'media');

DROP POLICY IF EXISTS "media_objects_insert" ON storage.objects;
CREATE POLICY "media_objects_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "media_objects_update" ON storage.objects;
CREATE POLICY "media_objects_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "media_objects_delete" ON storage.objects;
CREATE POLICY "media_objects_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media');
