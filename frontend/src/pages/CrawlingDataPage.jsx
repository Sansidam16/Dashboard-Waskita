import React, { useState } from 'react';

const CrawlingDataPage = () => {
  const [loading, setLoading] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
const [limit, setLimit] = useState(10);

  const handleCrawl = async () => {
    if (!keyword.trim()) {
      setError('Masukkan kata kunci pencarian!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/crawling/twitter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, limit })
      });
      const data = await res.json();
      console.log('Response dari backend:', data);
      if (data.success) {
        if (Array.isArray(data.tweets) && data.tweets.length > 0) {
          setTweets(data.tweets);
        } else {
          setTweets([]);
          setError('Tidak ada data hasil crawling.');
        }
      } else {
        setError(data.error || 'Gagal mengambil data');
      }
    } catch (err) {
      setError('Terjadi kesalahan: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Crawling Data Twitter/X</h1>
      <div className="mb-4">
        <input
          className="border px-2 py-1 mr-2"
          type="text"
          placeholder='Masukkan kata kunci, contoh: "jihad fisabilillah" OR #jihadfisabilillah'
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
        <input
          className="border px-2 py-1 mr-2"
          type="number"
          min={1}
          max={100}
          placeholder="Limit tweet (misal: 10)"
          value={limit}
          onChange={e => setLimit(Number(e.target.value))}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handleCrawl}
          disabled={loading}
        >
          {loading ? 'Mengambil Data...' : 'Ambil Tweet Terkait'}
        </button>
      </div>
      {error && <div className="mt-4 text-red-600">{error}</div>}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tweet table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              {/* Kolom dinamis sesuai urutan field actor */}
              {tweets[0] && Object.keys(tweets[0]).map((key) => (
                <TableCell key={key}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tweets.map((row, idx) => (
              <TableRow key={row.id || idx}>
                <TableCell>{idx+1}</TableCell>
                {Object.keys(row).map((key) => (
                  <TableCell key={key}>
                    {/* Render gambar profilePicture jika field author.profilePicture */}
                    {key === 'author' && row.author?.profilePicture ? (
                      <img src={row.author.profilePicture} alt="profile" width={32} style={{borderRadius:'50%'}} />
                    ) : key === 'extendedEntities' && row.extendedEntities?.media && Array.isArray(row.extendedEntities.media) && row.extendedEntities.media.length > 0 ? (
                      row.extendedEntities.media.map((media, mIdx) =>
                        media.media_url_https ? (
                          <img key={mIdx} src={media.media_url_https} alt="tweet-media" width={64} style={{marginRight:4, marginBottom:2}} />
                        ) : null
                      )
                    ) : Array.isArray(row[key]) || (typeof row[key] === 'object' && row[key] !== null) ? (
                      <pre style={{maxWidth:320, maxHeight:200, overflow:'auto', fontSize:10}}>{JSON.stringify(row[key], null, 2)}</pre>
                    ) : (
                      String(row[key])
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CrawlingDataPage;
