import app from './app.js';

// Gunakan .env untuk konfigurasi PORT dan secret penting lainnya
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
