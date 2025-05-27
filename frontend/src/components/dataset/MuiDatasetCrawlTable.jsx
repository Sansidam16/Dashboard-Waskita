import * as React from 'react';
import { DataGrid, GridToolbar, gridFilteredSortedRowIdsSelector, gridVisibleColumnFieldsSelector, useGridApiContext } from '@mui/x-data-grid';

// Helper for ellipsis in cell rendering
const renderEllipsis = (value, maxLine = 2) => {
  if (typeof value === 'object' && value !== null) {
    // Tampilkan ringkasan object
    if (value.id) return <span>{value.id}</span>;
    if (value.full_name) return <span>{value.full_name}</span>;
    if (value.name) return <span>{value.name}</span>;
    return <span>{JSON.stringify(value)}</span>;
  }
  if (Array.isArray(value)) {
    return <span>{value.join(', ')}</span>;
  }
  return <span style={{
    display: '-webkit-box',
    WebkitLineClamp: maxLine,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    whiteSpace: 'normal',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word',
    fontSize: 12
  }}>{value == null ? '-' : String(value)}</span>;
};

function getUniqueUserCount(rows) {
  const set = new Set();
  rows.forEach(row => {
    if (row.author && (row.author.userName || row.author.username)) set.add(row.author.userName || row.author.username);
    else if (row.userName || row.username) set.add(row.userName || row.username);
    else if (row.username) set.add(row.username);
  });
  return set.size;
}
function getAverageFollowers(rows) {
  let total = 0, count = 0;
  rows.forEach(row => {
    const a = row.author || row.user || {};
    if (a.followers && !isNaN(a.followers)) {
      total += Number(a.followers);
      count++;
    }
  });
  return count > 0 ? Math.round(total / count) : 0;
}

import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function MuiDatasetCrawlTable({ rows }) {
  // Define columns with reasonable width and ellipsis for long content
  const columns = [
    { field: 'username', headerName: 'Username', width: 120, pinnable: true, description: 'Nama pengguna Twitter/X', headerAlign: 'center', align: 'left' },
    { field: 'name', headerName: 'Name', width: 120, description: 'Nama asli pengguna', headerAlign: 'center', align: 'left' },
    { field: 'userId', headerName: 'User ID', width: 140, description: 'ID unik user', headerAlign: 'center', align: 'left' },
    { field: 'bio', headerName: 'Bio', width: 200, renderCell: (params) => renderEllipsis(params.value, 2), description: 'Deskripsi profil' },
    { field: 'profilePicture', headerName: 'Profile Picture', width: 70, renderCell: (params) => params.value ? <img src={params.value} alt="Profile" style={{width:32,height:32,borderRadius:'50%',objectFit:'cover'}} /> : '-', description: 'Foto profil' },
    { field: 'coverPicture', headerName: 'Cover Picture', width: 70, renderCell: (params) => params.value ? <img src={params.value} alt="Cover" style={{width:48,height:32,borderRadius:8,objectFit:'cover'}} /> : '-', description: 'Foto sampul' },
    // { field: 'profileBanner', ... } // Dihilangkan jika nilainya identik dengan coverPicture
    { field: 'location', headerName: 'Location', width: 160, renderCell: (params) => renderEllipsis(params.value, 2), description: 'Lokasi user' },
    { field: 'accountCreated', headerName: 'Account Created', width: 170, description: 'Tanggal akun dibuat', headerAlign: 'center', align: 'left' },
    { field: 'isVerified', headerName: 'Verified', width: 90, renderCell: (params) => params.value === true ? 'Ya' : params.value === false ? 'Tidak' : '-', description: 'User verified?' },
    { field: 'isBlueVerified', headerName: 'Twitter Blue', width: 110, renderCell: (params) => params.value === true ? 'Ya' : params.value === false ? 'Tidak' : '-', description: 'Akun Twitter Blue?' },
    { field: 'followers', headerName: 'Followers', width: 100, type: 'number', align: 'right', headerAlign: 'right', description: 'Jumlah followers' },
    // { field: 'followersCount', ... } // Dihilangkan agar tidak duplikat dengan followers
    { field: 'following', headerName: 'Following', width: 100, type: 'number', align: 'right', headerAlign: 'right', description: 'Jumlah following' },
    { field: 'fastFollowersCount', headerName: 'Fast Follower Count', width: 120, description: 'Jumlah fast followers' },
    { field: 'mediaCount', headerName: 'Media Count', width: 100, description: 'Jumlah media' },
    { field: 'statusesCount', headerName: 'Tweet Count', width: 100, description: 'Jumlah tweet' },
    { field: 'favouritesCount', headerName: 'Likes Given', width: 100, description: 'Jumlah likes yang diberikan' },
    { field: 'canDm', headerName: 'DM Allowed', width: 90, renderCell: (params) => params.value === true ? 'Ya' : params.value === false ? 'Tidak' : '-', description: 'Bisa DM?' },
    { field: 'canMediaTag', headerName: 'Taggable in Media', width: 120, renderCell: (params) => params.value === true ? 'Ya' : params.value === false ? 'Tidak' : '-', description: 'Bisa ditag di media?' },
    { field: 'hasCustomTimelines', headerName: 'Custom Timeline', width: 120, renderCell: (params) => params.value === true ? 'Ya' : params.value === false ? 'Tidak' : '-', description: 'Punya custom timeline?' },
    { field: 'isTranslator', headerName: 'Translator', width: 90, renderCell: (params) => params.value === true ? 'Ya' : params.value === false ? 'Tidak' : '-', description: 'User translator?' },
    { field: 'pinnedTweetIds', headerName: 'Pinned Tweets', width: 120, renderCell: (params) => renderEllipsis(params.value, 1), description: 'ID tweet yang dipin' },
    { field: 'profile_bio', headerName: 'Structured Bio', width: 200, renderCell: (params) => renderEllipsis(params.value, 2), description: 'Bio terstruktur' },
    { field: 'tweetText', headerName: 'Tweet Text', width: 220, renderCell: (params) => renderEllipsis(params.value, 2), description: 'Isi tweet', pinnable: true },
    { field: 'tweetUrl', headerName: 'Tweet URL', width: 220, renderCell: (params) => {
  const value = params.value;
  if (typeof value === 'string' && value.startsWith('http')) {
    return (
      <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: '#1d9bf0', textDecoration: 'underline', display: 'inline-block', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }} title={value}>
        {value.length > 40 ? value.slice(0, 37) + '...' : value}
      </a>
    );
  }
  return '-';
}, description: 'URL tweet' },
    // { field: 'twitterUrl', ... } // Dihilangkan agar tidak duplikat dengan tweetUrl
    { field: 'source', headerName: 'Source App', width: 120, renderCell: (params) => renderEllipsis(params.value, 1), description: 'Aplikasi sumber' },
    { field: 'lang', headerName: 'Language', width: 80, renderCell: (params) => renderEllipsis(params.value, 1), description: 'Bahasa' },
    { field: 'isReply', headerName: 'Is Reply', width: 90, renderCell: (params) => params.value === true ? 'Ya' : params.value === false ? 'Tidak' : '-', description: 'Merupakan reply?' },
    { field: 'inReplyToId', headerName: 'Replied Tweet ID', width: 120, renderCell: (params) => renderEllipsis(params.value, 1), description: 'ID tweet yang direply' },
    { field: 'inReplyToUserId', headerName: 'Replied User ID', width: 120, renderCell: (params) => renderEllipsis(params.value, 1), description: 'User ID yang direply' },
    { field: 'inReplyToUsername', headerName: 'Replied Username', width: 120, renderCell: (params) => renderEllipsis(params.value, 1), description: 'Username yang direply' },
    { field: 'conversationId', headerName: 'Conversation ID', width: 120, renderCell: (params) => renderEllipsis(params.value, 1), description: 'ID percakapan' },
    { field: 'retweeted_tweet', headerName: 'Retweeted Tweet', width: 120, renderCell: (params) => renderEllipsis(params.value, 1), description: 'Objek tweet yang di-retweet' },
    { field: 'quoted_tweet', headerName: 'Quoted Tweet', width: 120, renderCell: (params) => renderEllipsis(params.value, 1), description: 'Objek tweet yang di-quote' },
    { field: 'isPinned', headerName: 'Pinned Tweet', width: 100, renderCell: (params) => params.value === true ? 'Ya' : params.value === false ? 'Tidak' : '-', description: 'Tweet dipin?' },
    { field: 'isConversationControlled', headerName: 'Reply Control', width: 110, renderCell: (params) => params.value === true ? 'Ya' : params.value === false ? 'Tidak' : '-', description: 'Kontrol reply aktif?' },
    { field: 'retweetCount', headerName: 'Retweets', width: 90, renderCell: (params) => renderEllipsis(params.value, 1), description: 'Jumlah retweet' },
    { field: 'replyCount', headerName: 'Replies', width: 90, renderCell: (params) => renderEllipsis(params.value, 1), description: 'Jumlah reply' },
    { field: 'likeCount', headerName: 'Likes', width: 90, renderCell: (params) => renderEllipsis(params.value, 1), description: 'Jumlah like' },
    { field: 'quoteCount', headerName: 'Quote Tweets', width: 100, renderCell: (params) => renderEllipsis(params.value, 1), description: 'Jumlah quote tweet' },
    { field: 'viewCount', headerName: 'Views', width: 90, renderCell: (params) => renderEllipsis(params.value, 1), description: 'Jumlah view' },
    { field: 'bookmarkCount', headerName: 'Bookmarks', width: 90, renderCell: (params) => renderEllipsis(params.value, 1), description: 'Jumlah bookmark' },
    { field: 'tweetCreatedAt', headerName: 'Tweet Time', width: 170, renderCell: (params) => renderEllipsis(params.value, 1), description: 'Waktu tweet' },
    { field: 'place', headerName: 'Geolocation', width: 120, renderCell: (params) => renderEllipsis(params.value, 1), description: 'Lokasi geo tweet' },
  ];

  // Map backend/frontend fields to DataGrid rows
  const mappedRows = (rows || []).map((item, idx) => {
    const a = item.author || item.user || {};
    return {
      id: item.id || idx,
      username: a.userName || a.username,
      name: a.name,
      userId: a.id,
      bio: item.bio || (a.description || '-'),
      profilePicture: a.profilePicture,
      coverPicture: a.coverPicture,
      location: a.location,
      accountCreated: a.createdAt,
      isVerified: a.isVerified,
      isBlueVerified: a.isBlueVerified,
      followers: a.followers,
      following: a.following,
      fastFollowersCount: a.fastFollowersCount,
      mediaCount: a.mediaCount,
      statusesCount: a.statusesCount,
      favouritesCount: a.favouritesCount,
      canDm: a.canDm,
      canMediaTag: a.canMediaTag,
      hasCustomTimelines: a.hasCustomTimelines,
      isTranslator: a.isTranslator,
      pinnedTweetIds: a.pinnedTweetIds,
      profile_bio: a.profile_bio,
      tweetText: item.text,
      tweetUrl: item.url,
      source: item.source,
      lang: item.lang,
      isReply: item.isReply,
      inReplyToId: item.inReplyToId,
      inReplyToUserId: item.inReplyToUserId,
      inReplyToUsername: item.inReplyToUsername,
      conversationId: item.conversationId,
      retweeted_tweet: item.retweeted_tweet,
      quoted_tweet: item.quoted_tweet,
      isPinned: item.isPinned,
      isConversationControlled: item.isConversationControlled,
      retweetCount: item.retweetCount,
      replyCount: item.replyCount,
      likeCount: item.likeCount,
      quoteCount: item.quoteCount,
      viewCount: item.viewCount,
      bookmarkCount: item.bookmarkCount,
      tweetCreatedAt: item.createdAt,
      place: item.place,
    };
  });

  // Summary insight
  const totalTweet = mappedRows.length;
  const uniqueUser = getUniqueUserCount(rows);
  const avgFollowers = getAverageFollowers(rows);

  // State for row detail modal
  const [openDetail, setOpenDetail] = React.useState(false);
  const [detailRow, setDetailRow] = React.useState(null);

  // Handle row click to show modal
  const handleRowClick = React.useCallback((params) => {
    setDetailRow(params.row);
    setOpenDetail(true);
  }, []);

  // Render detail modal content
  function renderDetailModal() {
    if (!detailRow) return null;
    // Filter duplikat: jika ada dua field dengan isi identik, tampilkan hanya satu
    const shown = new Set();
    const entries = Object.entries(detailRow).filter(([key, value], idx, arr) => {
      // Hindari tampilkan twitterUrl jika tweetUrl sudah ada dan nilainya sama
      if (key === 'twitterUrl') {
        const tweetUrl = detailRow['tweetUrl'];
        if (tweetUrl && tweetUrl === value) return false;
      }
      // Hindari tampilkan followersCount jika followers sudah ada dan nilainya sama
      if (key === 'followersCount') {
        const followers = detailRow['followers'];
        if (followers && String(followers) === String(value)) return false;
      }
      // Hindari tampilkan profileBanner jika coverPicture sudah ada dan nilainya sama
      if (key === 'profileBanner') {
        const coverPicture = detailRow['coverPicture'];
        if (coverPicture && coverPicture === value) return false;
      }
      // Hindari duplikat value lain
      const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
      if (shown.has(valStr)) return false;
      shown.add(valStr);
      return true;
    });
    // Render all fields in a table-like format
    return (
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth>
        <DialogTitle className="flex items-center justify-between">
          Detail Tweet & User
          <IconButton onClick={() => setOpenDetail(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div className="overflow-x-auto">
            <table className="min-w-[320px] w-full text-sm">
              <tbody>
                {entries.map(([key, value]) => (
                  <tr key={key} className="border-b last:border-b-0">
                    <td className="font-semibold py-1 pr-2 align-top text-gray-600 whitespace-nowrap w-1/4">{key}</td>
                    <td className="py-1 pl-2 align-top break-all text-gray-900">
                      {typeof value === 'object' && value !== null ? (
                        <pre className="bg-gray-100 rounded px-2 py-1 text-xs max-w-[420px] overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>
                      ) : String(value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Quick Stats */}
      <div className="flex flex-wrap gap-4 mb-2 px-2">
        <div className="bg-blue-50 text-blue-900 rounded px-3 py-1 text-xs font-semibold">Total Tweet: {totalTweet}</div>
        <div className="bg-green-50 text-green-900 rounded px-3 py-1 text-xs font-semibold">Unique User: {uniqueUser}</div>
        <div className="bg-yellow-50 text-yellow-900 rounded px-3 py-1 text-xs font-semibold">Avg Followers: {avgFollowers}</div>
      </div>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={mappedRows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          components={{ Toolbar: GridToolbar }}
          initialState={{
            pinnedColumns: { left: ['username', 'tweetText'] },
            columns: {
              columnVisibilityModel: {
                // Semua kolom default visible
              },
            },
          }}
          sx={{
            fontSize: 12,
            '& .MuiDataGrid-cell': { lineHeight: 1.2, py: 0.5 },
            '& .MuiDataGrid-columnHeaders': { background: '#e0edff', color: '#374151', fontWeight: 'bold', position: 'sticky', top: 0, zIndex: 2 },
            '& .MuiDataGrid-virtualScroller': { overflowX: 'auto' },
            minWidth: 900,
            // Responsive scroll
            '@media (max-width: 900px)': {
              fontSize: 11,
            },
          }}
          checkboxSelection
          disableRowSelectionOnClick
          sortingOrder={['desc', 'asc']}
          filterMode="client"
          sortingMode="client"
          onRowClick={handleRowClick}
        />
      </div>
      {renderDetailModal()}
    </div>
  );
}

