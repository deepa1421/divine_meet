
CREATE OR REPLACE FUNCTION public.increment_devotee_count()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.devotee_counter SET count = count + 1, updated_at = now() WHERE id = 1;
END;
$$;
