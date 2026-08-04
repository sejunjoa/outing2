const SUPABASE_URL = "https://jplwodfeeqbflqsvnfti.supabase.co";

const SUPABASE_ANON_KEY =
"sb_publishable_UF22A3ZqjBIIwfPlskXs_g_lBEsradA";

const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

const VAPID_PUBLIC_KEY =
"BJx5yvicJ2S74u5xdJ-Mb4_vVY7uEDaoJRDuPRskLk1vuZ5Cdetl5Jqtsd4m5jfdf1i8YPq-9vjC8RYpQtZumEo";