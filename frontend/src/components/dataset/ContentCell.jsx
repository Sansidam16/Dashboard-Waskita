import React, { useRef, useState, useEffect } from "react";
import { createPortal } from 'react-dom';

// Komponen untuk cell konten dengan dua baris, elipsis, popup modal, dan keamanan XSS
export default function ContentCell({ text }) {
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
      <td
        ref={ref}
        align="left"
        style={{
          maxWidth: 420,
          minWidth: 220,
          whiteSpace: 'pre-line',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          cursor: truncated ? 'pointer' : 'default',
          verticalAlign: 'top',
          fontSize: 13,
          textAlign: 'left',
        }}
        title={truncated ? 'Klik untuk lihat selengkapnya' : undefined}
        onClick={truncated ? () => setShowModal(true) : undefined}
      >
        {text}
      </td>
      {showModal && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: '#fff',
              padding: 32,
              borderRadius: 8,
              maxWidth: 500,
              minWidth: 320,
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{marginBottom:16,fontWeight:'bold'}}>Full Content</div>
            <div style={{whiteSpace:'pre-line',wordBreak:'break-word',fontSize:14}}>{text}</div>
            <button style={{marginTop:18,padding:'6px 18px',background:'#2563eb',color:'#fff',border:'none',borderRadius:4,cursor:'pointer'}} onClick={() => setShowModal(false)}>Tutup</button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
