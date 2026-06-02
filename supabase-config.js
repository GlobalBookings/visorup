// Supabase public configuration — loaded from config.json
// These are PUBLIC keys designed for client-side use, protected by Row Level Security
(function() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/supabase-env.json', false);
  try {
    xhr.send();
    if (xhr.status === 200) {
      window.VISORUP_SUPABASE = JSON.parse(xhr.responseText);
    }
  } catch (e) {
    console.warn('Supabase config not found — auth features disabled');
  }
})();
