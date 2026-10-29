const SUPABASE_URL = "https://bokrdyglxoyqazkpvrlz.supabase.co";

const SUPABASE_ANON_KEY =
"sb_publishable_lRLqTDoy-tC34wsmrgOiIw_RnvYzDc9";

const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

const VAPID_PUBLIC_KEY =
"BH-LzXhBZuoE3-lftVYGoZ8bMmARisMBQZcJDH1G9q20tc1ho1t5t40B7_xBX40ktj8-CdMu2CXcRGLXFyvVcas";