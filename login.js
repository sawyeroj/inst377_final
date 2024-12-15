const supabaseUrl = 'https://hmlxxrimuutrnbyiyvwu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbHh4cmltdXV0cm5ieWl5dnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzNDA3ODEsImV4cCI6MjA0ODkxNjc4MX0.TFE2vQE7mFGElRMIjBKkEV9QlfaFBh6Qg8UCfrM4Z5s';
const db = supabase.createClient(supabaseUrl, supabaseKey);

async function fetch_db() {
    const { data, error } = await db.from('user_pw').select('username');
    if (error) {
        console.error("ERROR Fetching usernames");
    } else {
        console.log(data);
    }
}

fetch_db();