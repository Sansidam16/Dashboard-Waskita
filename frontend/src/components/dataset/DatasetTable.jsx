import React, { useState, useEffect } from 'react';
import ContentCell from './ContentCell';

import DatasetFormModal from './DatasetFormModal';
import Modal from '../shared/Modal';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const PAGE_SIZE = 10; // Default 10 rows per page

const DatasetTable = ({ refresh, showToast }) => {
  // DEBUG: log saat komponen dirender
  console.log('DEBUG RENDER: Komponen DatasetTable dirender');
  // State untuk popup modal teks tweet
  const [modalText, setModalText] = useState('');
  // --- Tweet Pagination State ---
  const [tweetPage, setTweetPage] = useState(1);
  const tweetPerPage = 10;

  const [selectedDataset, setSelectedDataset] = useState(null);
  const [datasetTweets, setDatasetTweets] = useState([]);
  const [tweetsLoading, setTweetsLoading] = useState(false);
  const [tweetsError, setTweetsError] = useState('');
  const [activeDatasetId, setActiveDatasetId] = useState(null); // Untuk indikator aktif tombol 'Lihat'
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [internalRefresh, setInternalRefresh] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filterSource, setFilterSource] = useState('');

  // --- Tweet Pagination Logic ---
  const tweetTotalPages = Math.max(1, Math.ceil(datasetTweets.length / tweetPerPage));
  const tweetPagedData = datasetTweets.slice((tweetPage-1)*tweetPerPage, tweetPage*tweetPerPage);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    fetch('/api/datasets', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.success && Array.isArray(data.datasets)) {
          setDatasets(data.datasets);
        } else {
          setDatasets([]);
          if (data.error && showToast) showToast({ message: data.error, type: 'error' });
        }
        setLoading(false);
      })
      .catch(err => {
        setDatasets([]);
        if (showToast) showToast({ message: err.message || 'Gagal mengambil data dataset', type: 'error' });
        setLoading(false);
      });
  }, [refresh, internalRefresh]);

  const handleEdit = (dataset) => setEditData(dataset);
  const handleDelete = (dataset) => setDeleteData(dataset);
  const handleEditSuccess = () => {
    setEditData(null);
    setInternalRefresh(r => !r);
  };
  const handleDeleteConfirm = async () => {
    setModalLoading(true);
    try {
      const res = await fetch(`/api/${deleteData.id}`, { method: 'DELETE' });
      if (res.ok) {
        if (showToast) showToast({ message: 'Dataset berhasil dihapus!', type: 'success' });
      } else {
        const data = await res.json();
        if (showToast) showToast({ message: data.error || 'Gagal menghapus dataset', type: 'error' });
      }
      setDeleteData(null);
      setInternalRefresh(r => !r);
    } finally {
      setModalLoading(false);
    }
  };

  // Filtering, searching, and pagination
  let filtered = Array.isArray(datasets) ? datasets.filter(ds =>
    (!filterSource || ds.source === filterSource) &&
    (ds.keyword?.toLowerCase().includes(search.toLowerCase()) ||
     ds.name?.toLowerCase().includes(search.toLowerCase()) ||
     ds.filename?.toLowerCase().includes(search.toLowerCase()) ||
     String(ds.id).includes(search))
  ) : [];
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const pagedData = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  // Handler: fetch tweets for selected dataset
  const handleSelectDataset = (ds) => {
    setActiveDatasetId(ds.id); // Set id dataset yang sedang loading
    setSelectedDataset(ds);
    setTweetsLoading(true);
    setTweetsError('');
    setDatasetTweets([]);
    const token = localStorage.getItem('token');
    fetch(`/api/crawling/tweets?dataset=${encodeURIComponent(ds.name || ds.keyword || '')}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.tweets)) {
          setDatasetTweets(data.tweets);
        } else {
          setTweetsError(data.error || 'Gagal mengambil tweet dataset');
        }
        setTweetsLoading(false);
        setActiveDatasetId(null); // Reset setelah selesai
      })
      .catch(err => {
        setTweetsError(err.message || 'Gagal mengambil tweet dataset');
        setTweetsLoading(false);
        setActiveDatasetId(null);
      });
  }

  useEffect(() => { setPage(1); }, [search, filterSource, datasets.length]);

  // Hitung statistik summary berdasarkan filtered data
  const totalDataset = filtered.length;
  const totalFollowers = filtered.reduce((sum, ds) => sum + (ds.followers ?? 0), 0);
  const avgFollowers = totalDataset > 0 ? Math.round(totalFollowers / totalDataset) : 0;

  return (
    <div>

      {/* Grafik Mini (akan diisi setelah chart.js/react-chartjs-2 siap) */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* <MiniChartLocation data={sortedData} /> */}
        {/* <MiniChartVerified data={sortedData} /> */}
      </div>
      <div className="flex gap-2 items-center flex-wrap">

        <input
          className="border rounded px-2 py-1 text-sm"
          placeholder="Cari cepat..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-2 py-1 text-sm"
          value={filterSource}
          onChange={e => setFilterSource(e.target.value)}
        >
          <option value="">Semua Sumber</option>
          <option value="crawling">Crawling</option>
          <option value="upload">Upload</option>
        </select>
      </div>
      <div className="text-xs text-gray-500">Total: {filtered.length} data</div>
      <div className="w-full h-[80vh] flex flex-col bg-background p-0 m-0 rounded shadow border overflow-y-auto overflow-x-auto mt-4">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-30 bg-white shadow" style={{position:'sticky', top:0, zIndex:30, background:'#fff'}}>
            <tr>
              <th className="px-1 py-1">No</th>
              <th className="px-1 py-1">ID</th>
              <th className="px-1 py-1">Sumber Data</th>
              <th className="px-1 py-1">Keyword/Nama File</th>
              <th className="px-1 py-1">Jumlah Record</th>
              <th className="px-1 py-1">Tanggal Simpan</th>
              <th className="px-1 py-1">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center p-4">Memuat data...</td></tr>
            ) : pagedData.length === 0 ? (
              <tr><td colSpan={6} className="text-center p-4">Tidak ada data</td></tr>
            ) : (
               pagedData.concat(Array.from({length: PAGE_SIZE - pagedData.length}, (_, idx) => null)).map((ds, idx) => (
                ds ? (
                  <tr key={ds.id} className={`border-b cursor-pointer even:bg-gray-50 odd:bg-white hover:bg-blue-50`} onClick={() => handleSelectDataset(ds)}>
                    <td className="px-1 py-1 text-center">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td className="px-1 py-1 text-center">{ds.id}</td>
                    <td className="px-1 py-1 text-center capitalize">{ds.source || '-'}</td>
                    <td className="px-1 py-1 min-w-[120px] max-w-[160px] whitespace-normal break-words">{ds.name || ds.keyword || ds.filename || '-'}</td>
                    <td className="px-1 py-1 text-center">{ds.record_count ?? ds.items ?? ds.jumlah_item ?? '-'}</td>
                    <td className="px-1 py-1 text-center">{ds.created_at?.slice(0, 10) || '-'}</td>
                    <td className="px-1 py-1 flex gap-1 justify-center">
                      <button
                        title="Lihat"
                        aria-label={`Lihat detail dataset ${ds.id}`}
                        tabIndex={0}
                        className={`p-1 rounded hover:bg-primary/10 flex items-center justify-center focus:outline-none focus:ring focus:ring-blue-200 ${activeDatasetId === ds.id && tweetsLoading ? 'bg-blue-100 cursor-wait' : ''}`}
                        onClick={e => {e.stopPropagation(); handleSelectDataset(ds);}}
                        disabled={tweetsLoading && activeDatasetId === ds.id}
                      >
                        {activeDatasetId === ds.id && tweetsLoading ? (
                          <span className="loader-spinner"></span>
                        ) : (
                          <FaEye className="text-blue-600" />
                        )}
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={`empty-${idx}`} className={`even:bg-gray-50 odd:bg-white`}>
                    <td className="py-1 text-center">&nbsp;</td>
                    <td colSpan={6} className="py-1">&nbsp;</td>
                  </tr>
                )
              ))
            )}
          </tbody>
        </table>
        <div className="w-full mt-2 flex flex-col gap-2">
          <div className="text-xs text-gray-600 text-center mb-1">
            Total: {filtered.length} data
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center w-full">
              <button
                className="px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 text-xs font-semibold disabled:opacity-50"
                onClick={() => setPage(page-1)}
                disabled={page === 1}
              >Prev</button>
              <span className="mx-2 text-xs text-gray-500">Halaman {page} dari {totalPages}</span>
              <button
                className="px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 text-xs font-semibold disabled:opacity-50"
                onClick={() => setPage(page+1)}
                disabled={page === totalPages}
              >Next</button>
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center w-full">
            <button
              className="px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 text-xs font-semibold disabled:opacity-50"
              onClick={() => setPage(page-1)}
              disabled={page === 1}
            >Prev</button>
            <span className="mx-2 text-xs text-gray-500">Halaman {page} dari {totalPages}</span>
            <button
              className="px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 text-xs font-semibold disabled:opacity-50"
              onClick={() => setPage(page+1)}
              disabled={page === totalPages}
            >Next</button>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center w-full">
          <button
            className="px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 text-xs font-semibold disabled:opacity-50"
            onClick={() => setPage(page-1)}
            disabled={page === 1}
          >Prev</button>
          <span className="mx-2 text-xs text-gray-500">Halaman {page} dari {totalPages}</span>
          <button
            className="px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 text-xs font-semibold disabled:opacity-50"
            onClick={() => setPage(page+1)}
            disabled={page === totalPages}
          >Next</button>
        </div>
      )}
    {selectedDataset && (
      <div className="w-full mt-8 bg-white rounded shadow p-4">
        <div className="font-semibold text-base mb-2">Detail Tweet Dataset</div>
        <div className="p-6 bg-background">
          <table className="w-full text-xs">
            <thead className="sticky top-0 z-30 bg-white shadow">
              <tr>
  <th className="px-1 py-1 text-center">No</th>
  <th className="px-1 py-1 min-w-[120px] max-w-[160px] whitespace-normal">Username</th>
  <th className="px-1 py-1 min-w-[120px] max-w-[160px] whitespace-normal">Name</th>
  <th className="px-1 py-1">Username</th>
  <th className="px-1 py-1">Name</th>
  <th className="px-1 py-1">User ID</th>
  <th className="px-1 py-1">Bio</th>
  <th className="px-1 py-1">Profile Picture</th>
  <th className="px-1 py-1">Cover Picture</th>
  <th className="px-1 py-1">Location</th>
  <th className="px-1 py-1">Account Created</th>
  <th className="px-1 py-1">Verified</th>
  <th className="px-1 py-1">Twitter Blue</th>
  <th className="px-1 py-1">Followers</th>
  <th className="px-1 py-1">Following</th>
  <th className="px-1 py-1">Fast Follower Count</th>
  <th className="px-1 py-1">Media Count</th>
  <th className="px-1 py-1">Tweet Count</th>
  <th className="px-1 py-1">Likes Given</th>
  <th className="px-1 py-1">DM Allowed</th>
  <th className="px-1 py-1">Taggable in Media</th>
  <th className="px-1 py-1">Custom Timeline</th>
  <th className="px-1 py-1">Translator</th>
  <th className="px-1 py-1">Pinned Tweets</th>
  <th className="px-1 py-1">Structured Bio</th>
  <th className="px-1 py-1">Tweet Text</th>
  <th className="px-1 py-1">Tweet URL</th>
  <th className="px-1 py-1">Source App</th>
  <th className="px-1 py-1">Language</th>
  <th className="px-1 py-1">Is Reply</th>
  <th className="px-1 py-1">Replied Tweet ID</th>
  <th className="px-1 py-1">Replied User ID</th>
  <th className="px-1 py-1">Replied Username</th>
  <th className="px-1 py-1">Conversation ID</th>
  <th className="px-1 py-1">Retweeted Tweet</th>
  <th className="px-1 py-1">Quoted Tweet</th>
  <th className="px-1 py-1">Pinned Tweet</th>
  <th className="px-1 py-1">Reply Control</th>
  <th className="px-1 py-1">Retweets</th>
  <th className="px-1 py-1">Replies</th>
  <th className="px-1 py-1">Likes</th>
  <th className="px-1 py-1">Quote Tweets</th>
  <th className="px-1 py-1">Views</th>
  <th className="px-1 py-1">Bookmarks</th>
  <th className="px-1 py-1 text-center min-w-[120px] max-w-[160px]">Tweet Time</th>
  <th className="px-1 py-1">Geolocation</th>
</tr>
            </thead>
            {/* DEBUG LOG: tampilkan data datasetTweets di console */}
            {console.log('DEBUG datasetTweets STATE:', datasetTweets)}
            <tbody>
              {datasetTweets.map((tweet, index) => (
                <tr key={tweet.id || index}>
  <td>{tweet.author?.userName ?? tweet.userName ?? '-'}</td>
  <td>{tweet.author?.name ?? tweet.name ?? '-'}</td>
  <td>{tweet.author?.id ?? tweet.id ?? '-'}</td>
  <td>{tweet.author?.description ?? tweet.description ?? '-'}</td>
  <td>{tweet.author?.profilePicture ? (<img src={tweet.author.profilePicture} alt="Profile" className="w-8 h-8 rounded-full mx-auto border" />) : (tweet.profilePicture ? (<img src={tweet.profilePicture} alt="Profile" className="w-8 h-8 rounded-full mx-auto border" />) : '-' )}</td>
  <td>{tweet.author?.coverPicture ? (<img src={tweet.author.coverPicture} alt="Cover" className="w-12 h-8 object-cover rounded mx-auto border" />) : (tweet.coverPicture ? (<img src={tweet.coverPicture} alt="Cover" className="w-12 h-8 object-cover rounded mx-auto border" />) : '-' )}</td>
  <td>{tweet.author?.location ?? tweet.location ?? '-'}</td>
  <td>{tweet.author?.createdAt ? new Date(tweet.author.createdAt).toLocaleDateString('id-ID') : (tweet.createdAt ? new Date(tweet.createdAt).toLocaleDateString('id-ID') : '-')}</td>
  <td>{tweet.author?.isVerified === true ? 'Ya' : tweet.author?.isVerified === false ? 'Tidak' : (tweet.isVerified === true ? 'Ya' : tweet.isVerified === false ? 'Tidak' : '-')}</td>
  <td>{tweet.author?.isBlueVerified === true ? 'Ya' : tweet.author?.isBlueVerified === false ? 'Tidak' : (tweet.isBlueVerified === true ? 'Ya' : tweet.isBlueVerified === false ? 'Tidak' : '-')}</td>
  <td>{tweet.author?.followers ?? tweet.followers ?? '-'}</td>
  <td>{tweet.author?.following ?? tweet.following ?? '-'}</td>
  <td>{tweet.author?.fastFollowersCount ?? tweet.fastFollowersCount ?? '-'}</td>
  <td>{tweet.author?.mediaCount ?? tweet.mediaCount ?? '-'}</td>
  <td>{tweet.author?.statusesCount ?? tweet.statusesCount ?? '-'}</td>
  <td>{tweet.author?.favouritesCount ?? tweet.favouritesCount ?? '-'}</td>
  <td>{tweet.author?.canDm === true ? 'Ya' : tweet.author?.canDm === false ? 'Tidak' : (tweet.canDm === true ? 'Ya' : tweet.canDm === false ? 'Tidak' : '-' )}</td>
  <td>{tweet.author?.canMediaTag === true ? 'Ya' : tweet.author?.canMediaTag === false ? 'Tidak' : (tweet.canMediaTag === true ? 'Ya' : tweet.canMediaTag === false ? 'Tidak' : '-' )}</td>
  <td>{tweet.author?.hasCustomTimelines === true ? 'Ya' : tweet.author?.hasCustomTimelines === false ? 'Tidak' : (tweet.hasCustomTimelines === true ? 'Ya' : tweet.hasCustomTimelines === false ? 'Tidak' : '-' )}</td>
  <td>{tweet.author?.isTranslator === true ? 'Ya' : tweet.author?.isTranslator === false ? 'Tidak' : (tweet.isTranslator === true ? 'Ya' : tweet.isTranslator === false ? 'Tidak' : '-' )}</td>
  <td>{tweet.author?.pinnedTweetIds ? JSON.stringify(tweet.author.pinnedTweetIds) : (tweet.pinnedTweetIds ? JSON.stringify(tweet.pinnedTweetIds) : '-' )}</td>
  <td>{tweet.author?.profile_bio ?? tweet.profile_bio ?? '-'}</td>
  <td>{tweet.text ?? '-'}</td>
  <td>{tweet.url ?? '-'}</td>
  <td>{tweet.source ?? '-'}</td>
  <td>{tweet.lang ?? '-'}</td>
  <td>{tweet.isReply === true ? 'Ya' : tweet.isReply === false ? 'Tidak' : '-'}</td>
  <td>{tweet.inReplyToId ?? '-'}</td>
  <td>{tweet.inReplyToUserId ?? '-'}</td>
  <td>{tweet.inReplyToUsername ?? '-'}</td>
  <td>{tweet.conversationId ?? '-'}</td>
  <td>{tweet.retweeted_tweet ? JSON.stringify(tweet.retweeted_tweet) : '-'}</td>
  <td>{tweet.quoted_tweet ? JSON.stringify(tweet.quoted_tweet) : '-'}</td>
  <td>{tweet.isPinned === true ? 'Ya' : tweet.isPinned === false ? 'Tidak' : '-'}</td>
  <td>{tweet.isConversationControlled === true ? 'Ya' : tweet.isConversationControlled === false ? 'Tidak' : '-'}</td>
  <td>{tweet.retweetCount ?? '-'}</td>
  <td>{tweet.replyCount ?? '-'}</td>
  <td>{tweet.likeCount ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {tweetTotalPages > 1 && (
            <div className="flex justify-center w-full">
              <button
                className="px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 text-xs font-semibold disabled:opacity-50"
                onClick={() => setTweetPage(tweetPage-1)}
                disabled={tweetPage === 1}
              >Prev</button>
              <span className="mx-2 text-xs text-gray-500">Halaman {tweetPage} dari {tweetTotalPages}</span>
              <button
                className="px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 text-xs font-semibold disabled:opacity-50"
                onClick={() => setTweetPage(tweetPage+1)}
                disabled={tweetPage === tweetTotalPages}
              >Next</button>
            </div>
          )}
          {modalText && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
                  onClick={() => setModalText('')}
                >×</button>
                <div className="whitespace-pre-line break-words text-sm max-h-[70vh] overflow-auto">
                  {modalText}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);
}

export default DatasetTable;
