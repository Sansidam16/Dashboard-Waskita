import React, { useEffect, useState } from 'react';
import Button from '../shared/Button';
import DataItemFormModal from './DataItemFormModal';
import Modal from '../shared/Modal';
import { FaUserShield } from 'react-icons/fa';

const DataItemTable = ({ datasetId, onSelect, showToast }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!datasetId) return;
    setLoading(true);
    fetch(`/api/data-item?dataset_id=${datasetId}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        console.log('[DataItemTable] items:', data);
        setLoading(false);
      });
  }, [datasetId, refresh]);

  const handleEdit = (item) => setEditData(item);
  const handleDelete = (item) => setDeleteData(item);
  const handleEditSuccess = (msg) => {
    setEditData(null);
    setRefresh(r => !r);
    if (showToast) showToast({ message: msg, type: 'success' });
  };
  const handleDeleteConfirm = async () => {
    setModalLoading(true);
    try {
      const res = await fetch(`/api/data-item/${deleteData.id}`, { method: 'DELETE' });
      if (res.ok) {
        if (showToast) showToast({ message: 'Data item berhasil dihapus!', type: 'success' });
      } else {
        const data = await res.json();
        if (showToast) showToast({ message: data.error || 'Gagal menghapus data item', type: 'error' });
      }
      setDeleteData(null);
      setRefresh(r => !r);
    } finally {
      setModalLoading(false);
    }
  };

  if (!datasetId) return <div className="p-4 text-gray-500">Pilih dataset untuk melihat data item.</div>;

  return (
    <div className="overflow-x-auto rounded shadow bg-white mt-4">
      <div className="flex justify-between items-center p-4">
        <h3 className="font-bold">Data Item</h3>
        <Button color="accent" onClick={() => setEditData({ dataset_id: datasetId })}>Tambah Data Item</Button>
      </div>
      <table className="min-w-full text-sm">
        <thead className="bg-secondary text-white">
  <tr>
    <th className="px-2 py-2">Username</th>
    <th className="px-2 py-2">Name</th>
    <th className="px-2 py-2">User ID</th>
    <th className="px-2 py-2">Bio</th>
    <th className="px-2 py-2">Profile Picture</th>
    <th className="px-2 py-2">Cover Picture</th>
    <th className="px-2 py-2">Location</th>
    <th className="px-2 py-2">Account Created</th>
    <th className="px-2 py-2">Verified</th>
    <th className="px-2 py-2">Twitter Blue</th>
    <th className="px-2 py-2">Followers</th>
    <th className="px-2 py-2">Following</th>
    <th className="px-2 py-2">Fast Follower Count</th>
    <th className="px-2 py-2">Media Count</th>
    <th className="px-2 py-2">Tweet Count</th>
    <th className="px-2 py-2">Likes Given</th>
    <th className="px-2 py-2">DM Allowed</th>
    <th className="px-2 py-2">Taggable in Media</th>
    <th className="px-2 py-2">Custom Timeline</th>
    <th className="px-2 py-2">Translator</th>
    <th className="px-2 py-2">Pinned Tweets</th>
    <th className="px-2 py-2">Structured Bio</th>
    <th className="px-2 py-2">Tweet Text</th>
    <th className="px-2 py-2">Tweet URL</th>
    <th className="px-2 py-2">Source App</th>
    <th className="px-2 py-2">Language</th>
    <th className="px-2 py-2">Is Reply</th>
    <th className="px-2 py-2">Replied Tweet ID</th>
    <th className="px-2 py-2">Replied User ID</th>
    <th className="px-2 py-2">Replied Username</th>
    <th className="px-2 py-2">Conversation ID</th>
    <th className="px-2 py-2">Retweeted Tweet</th>
    <th className="px-2 py-2">Quoted Tweet</th>
    <th className="px-2 py-2">Pinned Tweet</th>
    <th className="px-2 py-2">Reply Control</th>
    <th className="px-2 py-2">Retweets</th>
    <th className="px-2 py-2">Replies</th>
    <th className="px-2 py-2">Likes</th>
    <th className="px-2 py-2">Quote Tweets</th>
    <th className="px-2 py-2">Views</th>
    <th className="px-2 py-2">Bookmarks</th>
    <th className="px-2 py-2">Tweet Time</th>
    <th className="px-2 py-2">Geolocation</th>
    <th className="px-4 py-2">Aksi</th>
  </tr>
</thead>
        <tbody>
          {loading ? (
  <tr><td colSpan={44} className="text-center p-4">Memuat data...</td></tr>
) : items.length === 0 ? (
  <tr><td colSpan={44} className="text-center p-4">Tidak ada data item</td></tr>
) : (
  items.map(item => {
    const a = item.author || {};
    return (
      <tr key={item.id} className="border-b">
        <td className="px-2 py-2">{a.userName || a.username || '-'}</td>
        <td className="px-2 py-2">{a.name || '-'}</td>
        <td className="px-2 py-2">{a.id || '-'}</td>
        <td className="px-2 py-2">{a.description || a.bio || '-'}</td>
        <td className="px-2 py-2">{a.profilePicture ? <img src={a.profilePicture} alt="Profile" style={{width:32,height:32,borderRadius:'50%'}} /> : '-'}</td>
        <td className="px-2 py-2">{a.coverPicture || '-'}</td>
        <td className="px-2 py-2">{a.location || '-'}</td>
        <td className="px-2 py-2">{a.createdAt || '-'}</td>
        <td className="px-2 py-2">{a.isVerified !== undefined ? (a.isVerified ? 'Yes' : 'No') : '-'}</td>
        <td className="px-2 py-2">{a.isBlueVerified !== undefined ? (a.isBlueVerified ? 'Yes' : 'No') : '-'}</td>
        <td className="px-2 py-2">{a.followers ?? a.followersCount ?? '-'}</td>
        <td className="px-2 py-2">{a.following ?? a.followingCount ?? '-'}</td>
        <td className="px-2 py-2">{a.fastFollowersCount ?? '-'}</td>
        <td className="px-2 py-2">{a.mediaCount ?? '-'}</td>
        <td className="px-2 py-2">{a.statusesCount ?? a.statuses_count ?? '-'}</td>
        <td className="px-2 py-2">{a.favouritesCount ?? a.favourites_count ?? '-'}</td>
        <td className="px-2 py-2">{a.canDm !== undefined ? (a.canDm ? 'Yes' : 'No') : '-'}</td>
        <td className="px-2 py-2">{a.canMediaTag !== undefined ? (a.canMediaTag ? 'Yes' : 'No') : '-'}</td>
        <td className="px-2 py-2">{a.hasCustomTimelines !== undefined ? (a.hasCustomTimelines ? 'Yes' : 'No') : '-'}</td>
        <td className="px-2 py-2">{a.isTranslator !== undefined ? (a.isTranslator ? 'Yes' : 'No') : '-'}</td>
        <td className="px-2 py-2">{Array.isArray(a.pinnedTweetIds) ? (a.pinnedTweetIds.length > 0 ? a.pinnedTweetIds.join(', ') : '-') : (a.pinnedTweetIds ?? '-')}</td>
        <td className="px-2 py-2">{a.profile_bio && typeof a.profile_bio === 'object' ? (a.profile_bio.description || '-') : (a.profile_bio ?? '-')}</td>
        <td className="px-2 py-2">{item.text ?? '-'}</td>
        <td className="px-2 py-2">{item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Link</a> : '-'}</td>
        <td className="px-2 py-2">{item.source ?? '-'}</td>
        <td className="px-2 py-2">{item.lang ?? '-'}</td>
        <td className="px-2 py-2">{item.isReply !== undefined ? (item.isReply ? 'Yes' : 'No') : '-'}</td>
        <td className="px-2 py-2">{item.inReplyToId ?? '-'}</td>
        <td className="px-2 py-2">{item.inReplyToUserId ?? '-'}</td>
        <td className="px-2 py-2">{item.inReplyToUsername ?? '-'}</td>
        <td className="px-2 py-2">{item.conversationId ?? '-'}</td>
        <td className="px-2 py-2">{item.retweeted_tweet ?? '-'}</td>
        <td className="px-2 py-2">{item.quoted_tweet ?? '-'}</td>
        <td className="px-2 py-2">{item.isPinned !== undefined ? (item.isPinned ? 'Yes' : 'No') : '-'}</td>
        <td className="px-2 py-2">{item.isConversationControlled !== undefined ? (item.isConversationControlled ? 'Yes' : 'No') : '-'}</td>
        <td className="px-2 py-2">{item.retweetCount ?? '-'}</td>
        <td className="px-2 py-2">{item.replyCount ?? '-'}</td>
        <td className="px-2 py-2">{item.likeCount ?? '-'}</td>
        <td className="px-2 py-2">{item.quoteCount ?? '-'}</td>
        <td className="px-2 py-2">{item.viewCount ?? '-'}</td>
        <td className="px-2 py-2">{item.bookmarkCount ?? '-'}</td>
        <td className="px-2 py-2">{item.createdAt ?? '-'}</td>
        <td className="px-2 py-2">{item.place && typeof item.place === 'object' && Object.keys(item.place).length > 0 ? JSON.stringify(item.place) : '-'}</td>
        <td className="px-4 py-2">
          <Button color="accent" size="sm" onClick={() => handleEdit(item)}>Edit</Button>{' '}
          <Button color="secondary" size="sm" onClick={() => handleDelete(item)}>Hapus</Button>
        </td>
      </tr>
    );
  })
)}
        </tbody>
      </table>
      {/* Modal Edit/Tambah */}
      {editData && (
        <DataItemFormModal
          open={true}
          onClose={() => setEditData(null)}
          onSuccess={handleEditSuccess}
          data={editData}
        />
      )}
      {/* Modal Konfirmasi Hapus */}
      {deleteData && (
        <Modal onClose={() => setDeleteData(null)}>
          <div className="p-6">
            <div className="mb-4">Yakin ingin menghapus data item <b>{deleteData.value}</b>?</div>
            <div className="flex justify-end space-x-2">
              <button className="bg-secondary text-white px-4 py-2 rounded" onClick={() => setDeleteData(null)} disabled={modalLoading}>Batal</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleDeleteConfirm} disabled={modalLoading}>{modalLoading ? 'Menghapus...' : 'Hapus'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DataItemTable;
