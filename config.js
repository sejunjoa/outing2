const SUPABASE_URL = "https://jplwodfeeqbflqsvnfti.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwbHdvZGZlZXFiZmxxc3ZuZnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNDgxMTgsImV4cCI6MjA5ODcyNDExOH0.FhSIJqX4G0HMWxOuO9mwhfrBe2Wa3YuiIDlXXI4qnvU";

const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);