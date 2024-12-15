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

document.addEventListener('DOMContentLoaded', () => {
    supabaseUrl;
    supabaseKey;
    db;

    async function fetchData() {
      try {
        const { data, error } = await db
          .from('username')
          .select('*');

        if (error) {
          console.error('Error fetching data:', error);
          alert('Error fetching data. Check the console for details.');
        } else {
          console.log('Fetched data:', data);
          alert('Data fetched successfully. Check the console for details.');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        alert('An unexpected error occurred. Check the console for details.');
      }
    }

    const button = document.getElementById('login_button');
    button.addEventListener('click', fetchData);
  });