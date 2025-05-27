import React, { useState } from 'react';
import EmptyState from '../components/shared/EmptyState';
import Toast from '../components/shared/Toast';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

// Fungsi untuk ekstrak username dari url tweet (support x.com & twitter.com)
function extractUsernameFromUrl(url) {
  // Contoh url: https://x.com/username/status/123456 atau https://twitter.com/username/status/123456
  if (!url) return '';
  const match = url.match(/(?:twitter|x)\.com\/([^\/]+)\//);
  return match ? match[1] : '';
}

const CrawlingDataPage = () => {
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
const [limit, setLimit] = useState(10);

  const handleCrawl = async () => {
    if (!keyword.trim()) {
      setToast({ message: 'Masukkan kata kunci pencarian!', type: 'error' });
      setError('');
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

      if (data.success) {
        if (Array.isArray(data.tweets) && data.tweets.length > 0) {
          setTweets(data.tweets);
        } else {
          setTweets([]);
          setToast({ message: 'Tidak ada data hasil crawling.', type: 'info' });
        }
      } else {
        setToast({ message: data.error || 'Gagal mengambil data', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Terjadi kesalahan: ' + err.message, type: 'error' });
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
          placeholder='Masukkan kata kunci'
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
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {(!loading && tweets.length === 0) ? (
        <EmptyState message="Belum ada data hasil crawling. Silakan masukkan kata kunci dan ambil data." />
      ) : (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tweet table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Tweet ID<br /><span style={{fontSize:10}}>id</span></TableCell>
              <TableCell>Username<br /><span style={{fontSize:10}}>dari url</span></TableCell>
              <TableCell>Mention<br /><span style={{fontSize:10}}>entities.user_mentions</span></TableCell>
              <TableCell>Tweet URL<br /><span style={{fontSize:10}}>url</span></TableCell>
              <TableCell>Content<br /><span style={{fontSize:10}}>text</span></TableCell>
              <TableCell>Created At<br /><span style={{fontSize:10}}>createdAt</span></TableCell>
              <TableCell>Profile Picture<br /><span style={{fontSize:10}}>author.profilePicture</span></TableCell>
              <TableCell>Retweets<br /><span style={{fontSize:10}}>retweetCount</span></TableCell>
              <TableCell>Replies<br /><span style={{fontSize:10}}>replyCount</span></TableCell>
              <TableCell>Likes<br /><span style={{fontSize:10}}>likeCount</span></TableCell>
              <TableCell>Quotes<br /><span style={{fontSize:10}}>quoteCount</span></TableCell>
              <TableCell>Views<br /><span style={{fontSize:10}}>viewCount</span></TableCell>
              <TableCell>Bookmarks<br /><span style={{fontSize:10}}>bookmarkCount</span></TableCell>
              <TableCell>Source<br /><span style={{fontSize:10}}>source</span></TableCell>
              <TableCell>Language<br /><span style={{fontSize:10}}>lang</span></TableCell>
              <TableCell>Is Reply<br /><span style={{fontSize:10}}>isReply</span></TableCell>
              <TableCell>Is Retweet<br /><span style={{fontSize:10}}>isRetweet</span></TableCell>
              <TableCell>Is Quote<br /><span style={{fontSize:10}}>isQuote</span></TableCell>
              <TableCell>Is Pinned<br /><span style={{fontSize:10}}>isPinned</span></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tweets.map((tweet, idx) => {
              return (
                <TableRow key={idx}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{tweet.id || '-'}</TableCell>
                  <TableCell>{tweet.url ? extractUsernameFromUrl(tweet.url) : '-'}</TableCell>
                  <TableCell>{extractMentionsFromText(tweet.text)}</TableCell>
                  <TableCell>
                    {tweet.url ? (
                      <a href={tweet.url} target="_blank" rel="noopener noreferrer">{tweet.url}</a>
                    ) : '-'}
                  </TableCell>
                  <ContentCell text={tweet.text ?? '-'} />
                  <TableCell>{tweet.createdAt ?? '-'}</TableCell>
                  <TableCell>{tweet.author && tweet.author.profilePicture ? (
                    <img src={tweet.author.profilePicture} alt="profile" width={32} style={{borderRadius:'50%'}} />
                  ) : (
                    <img src="/default-profile.png" alt="profile-default" width={32} style={{borderRadius:'50%'}} />
                  )}</TableCell>
                  <TableCell>{tweet.retweetCount ?? 0}</TableCell>
                  <TableCell>{tweet.replyCount ?? 0}</TableCell>
                  <TableCell>{tweet.likeCount ?? 0}</TableCell>
                  <TableCell>{tweet.quoteCount ?? 0}</TableCell>
                  <TableCell>{tweet.viewCount ?? 0}</TableCell>
                  <TableCell>{tweet.bookmarkCount ?? 0}</TableCell>
                  <TableCell>{tweet.source || '-'}</TableCell>
                  <TableCell>{tweet.lang || '-'}</TableCell>
                  <TableCell>{tweet.isReply ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{tweet.isRetweet ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{tweet.isQuote ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{tweet.isPinned ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      )}
    </div>
  );
};

// Komponen untuk cell konten dengan dua baris, elipsis, popup modal, dan keamanan XSS
import React, { useRef, useState, useEffect } from 'react';

function ContentCell({ text }) {
  const ref = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [truncated, setTruncated] = useState(false);
  useEffect(() => {
    if (ref.current) {
      setTruncated(ref.current.scrollHeight > ref.current.clientHeight + 1);
    }
  }, [text]);
  return (
    <>
      <TableCell
        ref={ref}
        align="left"
        style={{
          maxWidth: 220,
          minWidth: 120,
          whiteSpace: 'pre-line',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          cursor: truncated ? 'pointer' : 'default',
          verticalAlign: 'top',
          fontSize: 13,
        }}
        title={truncated ? 'Klik untuk lihat selengkapnya' : undefined}
        onClick={truncated ? () => setShowModal(true) : undefined}
      >
        {text}
      </TableCell>
      {showModal && (
        <div
          style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.4)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{background:'#fff',padding:24,borderRadius:8,maxWidth:500,maxHeight:'70vh',overflowY:'auto',boxShadow:'0 4px 24px rgba(0,0,0,0.18)'}}
            onClick={e => e.stopPropagation()}
          >
            <div style={{marginBottom:16,fontWeight:'bold'}}>Full Content</div>
            <div style={{whiteSpace:'pre-line',wordBreak:'break-word',fontSize:14}}>{text}</div>
            <button style={{marginTop:18,padding:'6px 18px',background:'#2563eb',color:'#fff',border:'none',borderRadius:4,cursor:'pointer'}} onClick={()=>setShowModal(false)}>Tutup</button>
          </div>
        </div>
      )}
    </>
  );
}

// Fungsi ekstrak mention dari text tweet
function extractMentionsFromText(text) {
  if (!text) return '-';
  const mentions = text.match(/@([a-zA-Z0-9_]+)/g);
  return mentions && mentions.length > 0 ? mentions.join(', ') : '-';
}

export default CrawlingDataPage;
