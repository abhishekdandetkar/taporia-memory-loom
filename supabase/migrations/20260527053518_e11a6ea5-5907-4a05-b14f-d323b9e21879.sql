
-- 1. Make memories bucket private
UPDATE storage.buckets SET public = false WHERE id = 'memories';

-- 2. Drop any existing permissive policies on memories objects
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname LIKE 'memories_%'
  LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', p.policyname);
  END LOOP;
END $$;

-- Admin-only access to the memories bucket; public viewing should go through
-- signed URLs minted by a server function that verifies publication status.
CREATE POLICY "memories_admin_all"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'memories' AND public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (bucket_id = 'memories' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- 3. Fix mutable search_path on set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$function$;

-- 4. Revoke direct EXECUTE on SECURITY DEFINER helper functions from API roles.
-- RLS evaluation still works because policies run as the table owner context,
-- but the functions are no longer callable directly via PostgREST RPC.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
